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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabResult } from './entities/lab-result.entity';
import { TestCatalog } from './entities/test-catalog.entity';
import { LabRequest } from '../clinical/entities/lab-request.entity';
import { EventBusService } from '../auth/event-bus.service';
let LabService = class LabService {
    constructor(resultRepo, catalogRepo, requestRepo, eventBus) {
        this.resultRepo = resultRepo;
        this.catalogRepo = catalogRepo;
        this.requestRepo = requestRepo;
        this.eventBus = eventBus;
    }
    async createResult(dto, user) {
        // Only lab technicians should call this controller (controller enforces RBAC), but extra check can be performed
        // Validate lab request exists
        const req = await this.requestRepo.findOne({ where: { id: dto.labRequestId } });
        if (!req)
            throw new NotFoundException('Lab request not found');
        const test = await this.catalogRepo.findOne({ where: { id: dto.testId } });
        if (!test)
            throw new NotFoundException('Test not found');
        const result = this.resultRepo.create({ labRequest: req, test, value: dto.value, units: dto.units, status: 'COMPLETED', enteredBy: { id: user.sub } });
        const saved = await this.resultRepo.save(result);
        await this.eventBus.publish('LabResultUpdated', { labResultId: saved.id, at: new Date().toISOString() });
        await this.eventBus.publish('LabCompleted', { labRequestId: req.id, at: new Date().toISOString() });
        return saved;
    }
    async getResultsForRequest(requestId) {
        return this.resultRepo.find({ where: { labRequest: { id: requestId } }, order: { createdAt: 'ASC' } });
    }
    async listPendingForDepartment(departmentCode) {
        // Find lab requests for consultations related to visits or departments as needed. For simplicity, list all pending lab requests
        return this.requestRepo.find({ where: {}, order: { createdAt: 'ASC' } });
    }
};
LabService = __decorate([
    Injectable(),
    __param(0, InjectRepository(LabResult)),
    __param(1, InjectRepository(TestCatalog)),
    __param(2, InjectRepository(LabRequest)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        EventBusService])
], LabService);
export { LabService };
//# sourceMappingURL=lab.service.js.map