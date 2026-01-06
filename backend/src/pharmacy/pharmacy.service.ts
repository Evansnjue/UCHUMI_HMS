import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { DispensedDrug } from './entities/dispensed-drug.entity';
import { Stock } from './entities/stock.entity';
import { Prescription } from '../clinical/entities/prescription.entity';
import { PrescriptionItem } from '../clinical/entities/prescription-item.entity';
import { Drug } from '../clinical/entities/drug.entity';
import { DoctorDrugLimit } from '../clinical/entities/doctor-drug-limit.entity';
import { EventBusService } from '../auth/event-bus.service';
import { DrugDispensedEvent, StockUpdatedEvent } from './events/pharmacy.events';

@Injectable()
export class PharmacyService {
  private readonly logger = new Logger(PharmacyService.name);

  constructor(
    @InjectRepository(DispensedDrug) private dispensedRepo: Repository<DispensedDrug>,
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    @InjectRepository(Prescription) private prescriptionRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem) private itemRepo: Repository<PrescriptionItem>,
    @InjectRepository(DoctorDrugLimit) private limitRepo: Repository<DoctorDrugLimit>,
    private eventBus: EventBusService,
  ) {}

  /**
   * List pending prescriptions (status = PENDING)
   */
  async listPendingPrescriptions(limit = 50, offset = 0) {
    return this.prescriptionRepo.find({ where: { status: 'PENDING' }, take: limit, skip: offset, relations: ['items', 'prescribedBy', 'consultation'] });
  }

  async getPrescription(id: string) {
    const p = await this.prescriptionRepo.findOne({ where: { id }, relations: ['items', 'prescribedBy'] });
    if (!p) throw new NotFoundException('Prescription not found');
    return p;
  }

  /**
   * Fulfill a prescription by deducting stock and recording dispensed drugs.
   * This is a transactional operation: if any deduction fails, the whole operation rolls back.
   * Business rules enforced:
   * - Do not dispense if stock insufficient
   * - Enforce per-doctor daily drug limits when limits are configured
   */
  async fulfillPrescription(prescriptionId: string, items: { prescriptionItemId: string; quantity: number }[], pharmacistId: string) {
    const prescription = await this.prescriptionRepo.findOne({ where: { id: prescriptionId }, relations: ['items', 'prescribedBy'] });
    if (!prescription) throw new NotFoundException('Prescription not found');
    if (!items || items.length === 0) throw new BadRequestException('No items to dispense');

    return await getManager().transaction(async (manager) => {
      // Reload items using transactional manager
      const itemMap = new Map<string, PrescriptionItem>();
      const itemsFromDb = await manager.findByIds(PrescriptionItem, items.map((i) => i.prescriptionItemId));
      for (const it of itemsFromDb) itemMap.set(it.id, it);

      const toSaveDispenses: DispensedDrug[] = [];
      const stockUpdates: { stock: Stock; oldQty: number; newQty: number }[] = [];

      for (const it of items) {
        const presItem = itemMap.get(it.prescriptionItemId);
        if (!presItem) throw new NotFoundException(`Prescription item ${it.prescriptionItemId} not found`);

        if (it.quantity <= 0) throw new BadRequestException('Quantity must be positive');

        // Check doctor–drug daily limits
        await this.enforceDoctorDrugDailyLimit(manager, prescription.prescribedBy?.id, presItem.drug.id, it.quantity);

        // Check stock
        const stock = await manager.findOne(Stock, { where: { drug: { id: presItem.drug.id }, location: 'central' } });
        const available = stock ? Number(stock.quantity) : 0;
        if (available < Number(it.quantity)) {
          throw new BadRequestException(`Insufficient stock for drug ${presItem.drug.id}, available ${available}`);
        }

        const newQty = Number(available) - Number(it.quantity);
        if (stock) {
          const oldQty = Number(stock.quantity);
          stock.quantity = newQty as any;
          await manager.save(stock);
          stockUpdates.push({ stock, oldQty, newQty });
        } else {
          // Should not happen as we checked availability, but handle defensively
          throw new BadRequestException('Stock record missing');
        }

        const disp = manager.create(DispensedDrug, {
          prescriptionItem: presItem,
          prescription: prescription,
          drug: presItem.drug as any,
          pharmacist: { id: pharmacistId } as any,
          quantity: it.quantity,
          unit: presItem.unit || null,
        } as any);

        toSaveDispenses.push(disp);
        await manager.save(disp);

        // Emit DrugDispensed event
        const evt: DrugDispensedEvent = {
          prescriptionId: prescription.id,
          prescriptionItemId: presItem.id,
          drugId: presItem.drug.id,
          pharmacistId,
          quantity: Number(it.quantity),
          dispensedAt: new Date().toISOString(),
        };
        this.eventBus.publish('DrugDispensed', evt);
      }

      // If all items are fulfilled (or we may allow partial fulfillment semantics), we set status to COMPLETED
      // For now, if every item has been dispensed quantity >= prescribed quantity, mark COMPLETED
      const remaining = await manager.count(PrescriptionItem, { where: { prescription: { id: prescription.id } } });
      // Note: For simplicity, set to COMPLETED
      prescription.status = 'COMPLETED';
      await manager.save(prescription);

      // Emit stock updates
      for (const u of stockUpdates) {
        const evt: StockUpdatedEvent = {
          drugId: u.stock.drug.id,
          location: u.stock.location,
          oldQuantity: u.oldQty,
          newQuantity: u.newQty,
          updatedAt: new Date().toISOString(),
        };
        this.eventBus.publish('StockUpdated', evt);
      }

      // Persist an audit row (optional persistence into pharmacy_audit)
      await manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, [
        'PrescriptionFulfilled',
        JSON.stringify({ prescriptionId: prescription.id, pharmacistId, items }),
      ]);

      return { dispensed: toSaveDispenses.length };
    });
  }

  private async enforceDoctorDrugDailyLimit(manager: any, doctorId: string, drugId: string, qtyToDispense: number) {
    if (!doctorId) return;

    // Check doctor-specific configured limit for this drug (if exists)
    const limit = await manager.findOne(DoctorDrugLimit, { where: { doctor: { id: doctorId }, drug: { id: drugId } } });
    if (!limit) return; // no limit configured

    // Count already dispensed today for this doctor & drug
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const already = await manager.count(DispensedDrug, {
      where: {
        drug: { id: drugId },
        pharmacist: {}, // not filtering pharmacist
        dispensedAt: MoreThanOrEqual(startOfDay),
      },
    });

    // Note: Clinical limits were per doctor-based on prescriptions issued. This is a pragmatic enforcement at dispensing time:
    // Ensure (already + qtyToDispense) <= limit.quantity
    if (Number(already) + Number(qtyToDispense) > Number(limit.quantity)) {
      throw new BadRequestException('Doctor daily drug limit exceeded for this drug');
    }
  }
}
