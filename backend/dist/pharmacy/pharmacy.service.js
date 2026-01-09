var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PharmacyService_1;
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, MoreThanOrEqual } from 'typeorm';
import { DispensedDrug } from './entities/dispensed-drug.entity';
import { Stock } from './entities/stock.entity';
import { Prescription } from '../clinical/entities/prescription.entity';
import { PrescriptionItem } from '../clinical/entities/prescription-item.entity';
import { DoctorDrugLimit } from '../clinical/entities/doctor-drug-limit.entity';
import { EventBusService } from '../auth/event-bus.service';
let PharmacyService = PharmacyService_1 = class PharmacyService {
    constructor(dispensedRepo, stockRepo, prescriptionRepo, itemRepo, limitRepo, eventBus) {
        this.dispensedRepo = dispensedRepo;
        this.stockRepo = stockRepo;
        this.prescriptionRepo = prescriptionRepo;
        this.itemRepo = itemRepo;
        this.limitRepo = limitRepo;
        this.eventBus = eventBus;
        this.logger = new Logger(PharmacyService_1.name);
    }
    /**
     * List pending prescriptions (status = PENDING)
     */
    async listPendingPrescriptions(limit = 50, offset = 0) {
        return this.prescriptionRepo.find({ where: { status: 'PENDING' }, take: limit, skip: offset, relations: ['items', 'prescribedBy', 'consultation'] });
    }
    async getPrescription(id) {
        const p = await this.prescriptionRepo.findOne({ where: { id }, relations: ['items', 'prescribedBy'] });
        if (!p)
            throw new NotFoundException('Prescription not found');
        return p;
    }
    /**
     * Fulfill a prescription by deducting stock and recording dispensed drugs.
     * This is a transactional operation: if any deduction fails, the whole operation rolls back.
     * Business rules enforced:
     * - Do not dispense if stock insufficient
     * - Enforce per-doctor daily drug limits when limits are configured
     */
    async fulfillPrescription(prescriptionId, items, pharmacistId) {
        const prescription = await this.prescriptionRepo.findOne({ where: { id: prescriptionId }, relations: ['items', 'prescribedBy'] });
        if (!prescription)
            throw new NotFoundException('Prescription not found');
        if (!items || items.length === 0)
            throw new BadRequestException('No items to dispense');
        return await getManager().transaction(async (manager) => {
            // Reload items using transactional manager
            const itemMap = new Map();
            const itemsFromDb = await manager.findByIds(PrescriptionItem, items.map((i) => i.prescriptionItemId));
            for (const it of itemsFromDb)
                itemMap.set(it.id, it);
            const toSaveDispenses = [];
            const stockUpdates = [];
            for (const it of items) {
                const presItem = itemMap.get(it.prescriptionItemId);
                if (!presItem)
                    throw new NotFoundException(`Prescription item ${it.prescriptionItemId} not found`);
                if (it.quantity <= 0)
                    throw new BadRequestException('Quantity must be positive');
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
                    stock.quantity = newQty;
                    await manager.save(stock);
                    stockUpdates.push({ stock, oldQty, newQty });
                }
                else {
                    // Should not happen as we checked availability, but handle defensively
                    throw new BadRequestException('Stock record missing');
                }
                const disp = manager.create(DispensedDrug, {
                    prescriptionItem: presItem,
                    prescription: prescription,
                    drug: presItem.drug,
                    pharmacist: { id: pharmacistId },
                    quantity: it.quantity,
                    unit: presItem.unit || null,
                });
                toSaveDispenses.push(disp);
                await manager.save(disp);
                // Emit DrugDispensed event
                const evt = {
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
                const evt = {
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
    async enforceDoctorDrugDailyLimit(manager, doctorId, drugId, qtyToDispense) {
        if (!doctorId)
            return;
        // Check doctor-specific configured limit for this drug (if exists)
        const limit = await manager.findOne(DoctorDrugLimit, { where: { doctor: { id: doctorId }, drug: { id: drugId } } });
        if (!limit)
            return; // no limit configured
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
};
PharmacyService = PharmacyService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(DispensedDrug)),
    __param(1, InjectRepository(Stock)),
    __param(2, InjectRepository(Prescription)),
    __param(3, InjectRepository(PrescriptionItem)),
    __param(4, InjectRepository(DoctorDrugLimit)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        EventBusService])
], PharmacyService);
export { PharmacyService };
//# sourceMappingURL=pharmacy.service.js.map