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
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { Drug } from './entities/drug.entity';
import { DrugCategory } from './entities/drug-category.entity';
import { LabRequest } from './entities/lab-request.entity';
import { EventBusService } from '../auth/event-bus.service';
let ClinicalService = class ClinicalService {
    constructor(consultRepo, prescriptionRepo, itemsRepo, drugRepo, categoryRepo, labRepo, eventBus) {
        this.consultRepo = consultRepo;
        this.prescriptionRepo = prescriptionRepo;
        this.itemsRepo = itemsRepo;
        this.drugRepo = drugRepo;
        this.categoryRepo = categoryRepo;
        this.labRepo = labRepo;
        this.eventBus = eventBus;
    }
    async createConsultation(dto, doctor) {
        const patient = dto.patientId ? { id: dto.patientId } : null;
        // Validate patient exists
        // For brevity, rely on FK checks or integrate with patient service here
        const consult = this.consultRepo.create({ patient, doctor, diagnosis: dto.diagnosis, notes: dto.notes });
        return this.consultRepo.save(consult);
    }
    /**
     * Prescribe drugs and enforce daily drug category limits per doctor.
     * Limit semantics: for each category, a doctor's total quantity prescribed in a single day must not exceed the category.dailyLimit.
     */
    async createPrescription(dto, doctor) {
        // Load consultation
        const consult = await this.consultRepo.findOne({ where: { id: dto.consultationId }, relations: ['patient', 'doctor'] });
        if (!consult)
            throw new NotFoundException('Consultation not found');
        // Map drugId -> Drug and category
        const drugIds = dto.items.map((i) => i.drugId);
        const drugs = await this.drugRepo.findByIds(drugIds, { relations: ['category'] });
        if (drugs.length !== dto.items.length)
            throw new BadRequestException('Some drugs not found');
        // Compute quantities per category in this prescription
        const categoryQuantities = {};
        for (const item of dto.items) {
            const drug = drugs.find((d) => d.id === item.drugId);
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
            if (!cat)
                continue; // no limit defined
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
                if (proposedTotal > cat.dailyLimit)
                    throw new ForbiddenException(`Daily limit for category ${cat.name} exceeded. Allowed ${cat.dailyLimit}, would be ${proposedTotal}`);
            }
        }
        // Create prescription
        const prescription = this.prescriptionRepo.create({ consultation: consult, prescribedBy: doctor });
        prescription.items = dto.items.map((it) => this.itemsRepo.create({ drug: { id: it.drugId }, quantity: it.quantity, instructions: it.instructions }));
        const saved = await this.prescriptionRepo.save(prescription);
        await this.eventBus.publish('PrescriptionIssued', { prescriptionId: saved.id, at: new Date().toISOString() });
        return saved;
    }
    async createLabRequest(dto, doctor) {
        const consult = await this.consultRepo.findOne({ where: { id: dto.consultationId } });
        if (!consult)
            throw new NotFoundException('Consultation not found');
        const req = this.labRepo.create({ consultation: consult, requestedBy: doctor, testName: dto.testName, notes: dto.notes });
        const saved = await this.labRepo.save(req);
        await this.eventBus.publish('LabRequested', { labRequestId: saved.id, at: new Date().toISOString() });
        return saved;
    }
    async consultationsForPatient(patientId) {
        return this.consultRepo.find({ where: { patient: { id: patientId } }, relations: ['doctor'], order: { createdAt: 'DESC' } });
    }
    // ----- Admin helpers for drug categories & doctor limits -----
    async listCategories() {
        return this.categoryRepo.find();
    }
    async createCategory(name, dailyLimit = 0) {
        const c = this.categoryRepo.create({ name, dailyLimit });
        return this.categoryRepo.save(c);
    }
    async updateCategory(id, payload) {
        await this.categoryRepo.update(id, payload);
        return this.categoryRepo.findOne({ where: { id } });
    }
    async setDoctorLimit(doctorId, categoryId, dailyLimit) {
        // upsert behavior
        const existing = await this.categoryRepo.manager.getRepository('doctor_drug_limits').findOne({ where: { doctor: { id: doctorId }, category: { id: categoryId } }, relations: ['doctor', 'category'] });
        if (existing) {
            await this.categoryRepo.manager.getRepository('doctor_drug_limits').update(existing.id, { dailyLimit });
            return this.categoryRepo.manager.getRepository('doctor_drug_limits').findOne({ where: { id: existing.id }, relations: ['doctor', 'category'] });
        }
        const created = await this.categoryRepo.manager.getRepository('doctor_drug_limits').save({ doctor: { id: doctorId }, category: { id: categoryId }, dailyLimit });
        return created;
    }
    async getDoctorLimits(doctorId) {
        return this.categoryRepo.manager.getRepository('doctor_drug_limits').find({ where: { doctor: { id: doctorId } }, relations: ['doctor', 'category'] });
    }
};
ClinicalService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Consultation)),
    __param(1, InjectRepository(Prescription)),
    __param(2, InjectRepository(PrescriptionItem)),
    __param(3, InjectRepository(Drug)),
    __param(4, InjectRepository(DrugCategory)),
    __param(5, InjectRepository(LabRequest)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        EventBusService])
], ClinicalService);
export { ClinicalService };
//# sourceMappingURL=clinical.service.js.map