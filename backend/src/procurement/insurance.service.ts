import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsuranceClaim } from './entities/insurance-claim.entity';
import { CreateClaimDto, ProcessClaimDto } from './dto/create-claim.dto';
import { EventBusService } from '../auth/event-bus.service';
import { InsuranceClaimProcessedEvent } from './procurement.events';

@Injectable()
export class InsuranceService {
  constructor(@InjectRepository(InsuranceClaim) private claimRepo: Repository<InsuranceClaim>, private eventBus: EventBusService) {}

  async createClaim(dto: CreateClaimDto, actorId: string) {
    const c = this.claimRepo.create({ ...dto, submittedBy: actorId, status: 'SUBMITTED' } as any);
    return this.claimRepo.save(c);
  }

  async processClaim(claimId: string, dto: ProcessClaimDto, processorId: string) {
    const c = await this.claimRepo.findOne({ where: { id: claimId } });
    if (!c) throw new NotFoundException('claim not found');
    if (dto.action === 'APPROVE') {
      c.status = 'APPROVED';
      c.processedBy = processorId;
      c.processedAt = new Date();
    } else if (dto.action === 'REJECT') {
      c.status = 'REJECTED';
      c.processedBy = processorId;
      c.processedAt = new Date();
    } else if (dto.action === 'PAY') {
      if (c.status !== 'APPROVED') throw new BadRequestException('claim must be approved before payment');
      c.status = 'PAID';
      c.processedBy = processorId;
      c.processedAt = new Date();
    }
    if (dto.notes) c.notes = dto.notes;
    const saved = await this.claimRepo.save(c);

    const ev: InsuranceClaimProcessedEvent = { claimId: saved.id, claimNumber: saved.claimNumber, status: saved.status };
    this.eventBus.publish('InsuranceClaimProcessed', ev);

    return saved;
  }

  async listClaims(filter?: { status?: string, insurer?: string }) {
    const qb = this.claimRepo.createQueryBuilder('c');
    if (filter?.status) qb.where('c.status = :s', { s: filter.status });
    if (filter?.insurer) qb.andWhere('c.insurer = :i', { i: filter.insurer });
    qb.orderBy('c.created_at', 'DESC');
    return qb.getMany();
  }
}
