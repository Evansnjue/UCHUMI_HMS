import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { Drug } from './entities/drug.entity';
import { DrugCategory } from './entities/drug-category.entity';
import { LabRequest } from './entities/lab-request.entity';
import { CreateLabRequestDto } from './dto/create-lab-request.dto';
import { User } from '../auth/entities/user.entity';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class ClinicalService {
  constructor(
    @InjectRepository(Consultation) private consultRepo: Repository<Consultation>,
    @InjectRepository(Prescription) private prescriptionRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem) private itemsRepo: Repository<PrescriptionItem>,
    @InjectRepository(Drug) private drugRepo: Repository<Drug>,
    @InjectRepository(DrugCategory) private categoryRepo: Repository<DrugCategory>,
    @InjectRepository(LabRequest) private labRepo: Repository<LabRequest>,
    private eventBus: EventBusService,
  ) {}

  async createConsultation(dto: CreateConsultationDto, doctor: User) {
    const patient = dto.patientId ? { id: dto.patientId } as any : null;
    // Validate patient exists
    // For brevity, rely on FK checks or integrate with patient service here
    const consult = this.consultRepo.create({ patient, doctor, diagnosis: dto.diagnosis, notes: dto.notes } as any);
    return this.consultRepo.save(consult);
  }

  /**
   * Prescribe drugs and enforce daily drug category limits per doctor.
   * Limit semantics: for each category, a doctor's total quantity prescribed in a single day must not exceed the category.dailyLimit.
   */
  async createPrescription(dto: CreatePrescriptionDto, doctor: User) {
    // Load consultation
    const consult = await this.consultRepo.findOne({ where: { id: dto.consultationId }, relations: ['patient', 'doctor'] });
    if (!consult) throw new NotFoundException('Consultation not found');

    // Map drugId -> Drug and category
    const drugIds = dto.items.map((i) => i.drugId);
    const drugs = await this.drugRepo.findByIds(drugIds, { relations: ['category'] });
    if (drugs.length !== dto.items.length) throw new BadRequestException('Some drugs not found');

    // Compute quantities per category in this prescription
    const categoryQuantities: Record<string, number> = {};
    for (const item of dto.items) {
      const drug = drugs.find((d) => d.id === item.drugId)!;
      const catId = drug.category.id;
      categoryQuantities[catId] = (categoryQuantities[catId] || 0) + item.quantity;
    }

    // For each category, fetch daily limit and sum existing prescribed quantities by this doctor today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    for (const catId of Object.keys(categoryQuantities)) {
      const cat = await this.categoryRepo.findOne({ where: { id: catId } });
      if (!cat) continue; // no limit defined
      if (cat.dailyLimit && cat.dailyLimit > 0) {
        // Sum existing quantities for this doctor and category today
        const existingPrescriptions = await this.prescriptionRepo
          .createQueryBuilder('p')
          .leftJoinAndSelect('p.items', 'i')
          .leftJoinAndSelect('i.drug', 'd')
          .leftJoinAndSelect('d.category', 'c')
          .where('p.prescribedById = :doctorId', { doctorId: doctor.id })
          .andWhere('p.createdAt BETWEEN :start AND :end', { start: todayStart.toISOString(), end: todayEnd.toISOString() })
          .andWhere('c.id = :catId', { catId })
          .getMany();

        let existingQty = 0;
        for (const p of existingPrescriptions) {
          for (const it of p.items) {
            existingQty += it.quantity;
          }
        }
        const proposedTotal = existingQty + categoryQuantities[catId];
        if (proposedTotal > cat.dailyLimit) throw new ForbiddenException(`Daily limit for category ${cat.name} exceeded. Allowed ${cat.dailyLimit}, would be ${proposedTotal}`);
      }
    }

    // Create prescription
    const prescription = this.prescriptionRepo.create({ consultation: consult, prescribedBy: doctor } as any);
    prescription.items = dto.items.map((it) => this.itemsRepo.create({ drug: { id: it.drugId } as any, quantity: it.quantity, instructions: it.instructions } as any));
    const saved = await this.prescriptionRepo.save(prescription);

    await this.eventBus.publish('PrescriptionIssued', { prescriptionId: saved.id, at: new Date().toISOString() });
    return saved;
  }

  async createLabRequest(dto: CreateLabRequestDto, doctor: User) {
    const consult = await this.consultRepo.findOne({ where: { id: dto.consultationId } });
    if (!consult) throw new NotFoundException('Consultation not found');
    const req = this.labRepo.create({ consultation: consult, requestedBy: doctor, testName: dto.testName, notes: dto.notes } as any);
    const saved = await this.labRepo.save(req);
    await this.eventBus.publish('LabRequested', { labRequestId: saved.id, at: new Date().toISOString() });
    return saved;
  }

  async consultationsForPatient(patientId: string) {
    return this.consultRepo.find({ where: { patient: { id: patientId } }, relations: ['doctor'], order: { createdAt: 'DESC' } });
  }

  // ----- Admin helpers for drug categories & doctor limits -----
  async listCategories() {
    return this.categoryRepo.find();
  }

  async createCategory(name: string, dailyLimit = 0) {
    const c = this.categoryRepo.create({ name, dailyLimit } as any);
    return this.categoryRepo.save(c);
  }

  async updateCategory(id: string, payload: Partial<DrugCategory>) {
    await this.categoryRepo.update(id, payload as any);
    return this.categoryRepo.findOne({ where: { id } });
  }

  async setDoctorLimit(doctorId: string, categoryId: string, dailyLimit: number) {
    // upsert behavior
    const existing = await this.categoryRepo.manager.getRepository('doctor_drug_limits').findOne({ where: { doctor: { id: doctorId }, category: { id: categoryId } }, relations: ['doctor','category'] } as any);
    if (existing) {
      await this.categoryRepo.manager.getRepository('doctor_drug_limits').update(existing.id, { dailyLimit } as any);
      return this.categoryRepo.manager.getRepository('doctor_drug_limits').findOne({ where: { id: existing.id }, relations: ['doctor','category'] } as any);
    }
    const created = await this.categoryRepo.manager.getRepository('doctor_drug_limits').save({ doctor: { id: doctorId } as any, category: { id: categoryId } as any, dailyLimit } as any);
    return created;
  }

  async getDoctorLimits(doctorId: string) {
    return this.categoryRepo.manager.getRepository('doctor_drug_limits').find({ where: { doctor: { id: doctorId } }, relations: ['doctor','category'] } as any);
  }
}

