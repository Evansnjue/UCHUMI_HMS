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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { VisitStatus } from './entities/visit-status.entity';
import { QueueEntry } from './entities/queue.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Department } from '../patient/entities/department.entity';
import { EventBusService } from '../auth/event-bus.service';
import { VisitNumberService } from './visit-number.service';
let VisitService = class VisitService {
    constructor(visitRepo, statusRepo, queueRepo, patientRepo, deptRepo, eventBus, visitNumberService) {
        this.visitRepo = visitRepo;
        this.statusRepo = statusRepo;
        this.queueRepo = queueRepo;
        this.patientRepo = patientRepo;
        this.deptRepo = deptRepo;
        this.eventBus = eventBus;
        this.visitNumberService = visitNumberService;
    }
    /** Create a visit and enqueue it for the department. Enforce business rule: only one active per department */
    async create(dto, type = 'OPD') {
        const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
        if (!patient)
            throw new NotFoundException('Patient not found');
        const dept = await this.deptRepo.findOne({ where: { code: dto.departmentCode } });
        if (!dept)
            throw new NotFoundException('Department not found');
        // Business rule: patient can have multiple visits but only one active per department
        const activeStatus = await this.statusRepo.findOne({ where: { name: 'ACTIVE' } });
        const queuedStatus = await this.statusRepo.findOne({ where: { name: 'QUEUED' } });
        const existingActive = await this.visitRepo.findOne({ where: { patient: { id: patient.id }, department: { id: dept.id }, status: { id: activeStatus?.id } }, relations: ['status', 'department', 'patient'] });
        if (existingActive)
            throw new BadRequestException('Patient already has an active visit in this department');
        // Generate visitNumber if not provided
        const visitNumber = dto.visitNumber || (await this.visitNumberService.generate(dept.code, type));
        const visit = this.visitRepo.create({ visitNumber, patient, department: dept, status: queuedStatus, notes: dto.notes });
        const saved = await this.visitRepo.save(visit);
        // Add to queue
        await this.queueRepo.save(this.queueRepo.create({ department: dept, visit: saved }));
        await this.eventBus.publish('VisitCreated', { visitId: saved.id, at: new Date().toISOString() });
        return saved;
    }
    async complete(visitId) {
        const visit = await this.visitRepo.findOne({ where: { id: visitId }, relations: ['status', 'department'] });
        if (!visit)
            throw new NotFoundException('Visit not found');
        const completed = await this.statusRepo.findOne({ where: { name: 'COMPLETED' } });
        visit.status = completed;
        await this.visitRepo.save(visit);
        // Remove any queue entries
        await this.queueRepo.delete({ visit: { id: visit.id } });
        await this.eventBus.publish('VisitCompleted', { visitId: visit.id, at: new Date().toISOString() });
        return visit;
    }
    async getQueue(departmentCode) {
        const dept = await this.deptRepo.findOne({ where: { code: departmentCode } });
        if (!dept)
            throw new NotFoundException('Department not found');
        return this.queueRepo.find({ where: { department: { id: dept.id } }, order: { enqueuedAt: 'ASC' }, relations: ['visit', 'visit.patient'] });
    }
    async nextInQueue(departmentCode) {
        const q = await this.getQueue(departmentCode);
        if (!q || q.length === 0)
            return null;
        const entry = q[0];
        // mark visit active
        const active = await this.statusRepo.findOne({ where: { name: 'ACTIVE' } });
        entry.visit.status = active;
        await this.visitRepo.save(entry.visit);
        // remove queue entry
        await this.queueRepo.delete({ id: entry.id });
        await this.eventBus.publish('VisitCreated', { visitId: entry.visit.id, at: new Date().toISOString() });
        return entry.visit;
    }
    async historyForPatient(patientId) {
        return this.visitRepo.find({ where: { patient: { id: patientId } }, order: { createdAt: 'DESC' }, relations: ['department', 'status'] });
    }
};
VisitService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Visit)),
    __param(1, InjectRepository(VisitStatus)),
    __param(2, InjectRepository(QueueEntry)),
    __param(3, InjectRepository(Patient)),
    __param(4, InjectRepository(Department)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        EventBusService,
        VisitNumberService])
], VisitService);
export { VisitService };
//# sourceMappingURL=visit.service.js.map