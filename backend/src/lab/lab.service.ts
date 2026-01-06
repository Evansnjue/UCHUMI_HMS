import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabResult } from './entities/lab-result.entity';
import { CreateLabResultDto } from './dto/create-lab-result.dto';
import { TestCatalog } from './entities/test-catalog.entity';
import { LabRequest } from '../clinical/entities/lab-request.entity';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class LabService {
  constructor(
    @InjectRepository(LabResult) private resultRepo: Repository<LabResult>,
    @InjectRepository(TestCatalog) private catalogRepo: Repository<TestCatalog>,
    @InjectRepository(LabRequest) private requestRepo: Repository<LabRequest>,
    private eventBus: EventBusService,
  ) {}

  async createResult(dto: CreateLabResultDto, user: any) {
    // Only lab technicians should call this controller (controller enforces RBAC), but extra check can be performed
    // Validate lab request exists
    const req = await this.requestRepo.findOne({ where: { id: dto.labRequestId } });
    if (!req) throw new NotFoundException('Lab request not found');

    const test = await this.catalogRepo.findOne({ where: { id: dto.testId } });
    if (!test) throw new NotFoundException('Test not found');

    const result = this.resultRepo.create({ labRequest: req, test, value: dto.value, units: dto.units, status: 'COMPLETED', enteredBy: { id: user.sub } as any } as any);
    const saved = await this.resultRepo.save(result);
    await this.eventBus.publish('LabResultUpdated', { labResultId: saved.id, at: new Date().toISOString() });
    await this.eventBus.publish('LabCompleted', { labRequestId: req.id, at: new Date().toISOString() });
    return saved;
  }

  async getResultsForRequest(requestId: string) {
    return this.resultRepo.find({ where: { labRequest: { id: requestId } }, order: { createdAt: 'ASC' } });
  }

  async listPendingForDepartment(departmentCode: string) {
    // Find lab requests for consultations related to visits or departments as needed. For simplicity, list all pending lab requests
    return this.requestRepo.find({ where: {}, order: { createdAt: 'ASC' } as any });
  }
}
