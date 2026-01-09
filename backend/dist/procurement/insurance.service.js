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
import { InsuranceClaim } from './entities/insurance-claim.entity';
import { EventBusService } from '../auth/event-bus.service';
let InsuranceService = class InsuranceService {
    constructor(claimRepo, eventBus) {
        this.claimRepo = claimRepo;
        this.eventBus = eventBus;
    }
    async createClaim(dto, actorId) {
        const c = this.claimRepo.create({ ...dto, submittedBy: actorId, status: 'SUBMITTED' });
        return this.claimRepo.save(c);
    }
    async processClaim(claimId, dto, processorId) {
        const c = await this.claimRepo.findOne({ where: { id: claimId } });
        if (!c)
            throw new NotFoundException('claim not found');
        if (dto.action === 'APPROVE') {
            c.status = 'APPROVED';
            c.processedBy = processorId;
            c.processedAt = new Date();
        }
        else if (dto.action === 'REJECT') {
            c.status = 'REJECTED';
            c.processedBy = processorId;
            c.processedAt = new Date();
        }
        else if (dto.action === 'PAY') {
            if (c.status !== 'APPROVED')
                throw new BadRequestException('claim must be approved before payment');
            c.status = 'PAID';
            c.processedBy = processorId;
            c.processedAt = new Date();
        }
        if (dto.notes)
            c.notes = dto.notes;
        const saved = await this.claimRepo.save(c);
        const ev = { claimId: saved.id, claimNumber: saved.claimNumber, status: saved.status };
        this.eventBus.publish('InsuranceClaimProcessed', ev);
        return saved;
    }
    async listClaims(filter) {
        const qb = this.claimRepo.createQueryBuilder('c');
        if (filter?.status)
            qb.where('c.status = :s', { s: filter.status });
        if (filter?.insurer)
            qb.andWhere('c.insurer = :i', { i: filter.insurer });
        qb.orderBy('c.created_at', 'DESC');
        return qb.getMany();
    }
};
InsuranceService = __decorate([
    Injectable(),
    __param(0, InjectRepository(InsuranceClaim)),
    __metadata("design:paramtypes", [Repository, EventBusService])
], InsuranceService);
export { InsuranceService };
//# sourceMappingURL=insurance.service.js.map