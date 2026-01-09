import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { VisitStatus } from './entities/visit-status.entity';
import { QueueEntry } from './entities/queue.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { CompleteVisitDto } from './dto/complete-visit.dto';
import { Patient } from '../patient/entities/patient.entity';
import { Department } from '../patient/entities/department.entity';
import { EventBusService } from '../auth/event-bus.service';
import { VisitNumberService } from './visit-number.service';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit) private visitRepo: Repository<Visit>,
    @InjectRepository(VisitStatus) private statusRepo: Repository<VisitStatus>,
    @InjectRepository(QueueEntry) private queueRepo: Repository<QueueEntry>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    private eventBus: EventBusService,
    private visitNumberService: VisitNumberService,
  ) {}

  /** Create a visit and enqueue it for the department. Enforce business rule: only one active per department */
  async create(dto: CreateVisitDto, type: 'OPD' | 'IPD' = 'OPD') {
    const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException('Patient not found');

    const dept = await this.deptRepo.findOne({ where: { code: dto.departmentCode } });
    if (!dept) throw new NotFoundException('Department not found');

    // Business rule: patient can have multiple visits but only one active per department
    const activeStatus = await this.statusRepo.findOne({ where: { name: 'ACTIVE' } });
    const queuedStatus = await this.statusRepo.findOne({ where: { name: 'QUEUED' } });

    const existingActive = await this.visitRepo.findOne({ where: { patient: { id: patient.id }, department: { id: dept.id }, status: { id: activeStatus?.id } }, relations: ['status', 'department', 'patient'] });
    if (existingActive) throw new BadRequestException('Patient already has an active visit in this department');

    // Generate visitNumber if not provided
    const visitNumber = dto.visitNumber || (await this.visitNumberService.generate(dept.code, type));

    const visit: Visit = this.visitRepo.create({ visitNumber, patient, department: dept, status: queuedStatus, notes: dto.notes } as any) as unknown as Visit;
    const saved: Visit = await this.visitRepo.save(visit) as unknown as Visit;

    // Add to queue
    await this.queueRepo.save(this.queueRepo.create({ department: dept, visit: saved } as any));

    await this.eventBus.publish('VisitCreated', { visitId: saved.id, at: new Date().toISOString() });
    return saved;
  }

  async complete(visitId: string) {
    const visit = await this.visitRepo.findOne({ where: { id: visitId }, relations: ['status', 'department'] });
    if (!visit) throw new NotFoundException('Visit not found');
    const completed = await this.statusRepo.findOne({ where: { name: 'COMPLETED' } });
    visit.status = completed as any;
    await this.visitRepo.save(visit);
    // Remove any queue entries
    await this.queueRepo.delete({ visit: { id: visit.id } } as any);
    await this.eventBus.publish('VisitCompleted', { visitId: visit.id, at: new Date().toISOString() });
    return visit;
  }

  async getQueue(departmentCode: string) {
    const dept = await this.deptRepo.findOne({ where: { code: departmentCode } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.queueRepo.find({ where: { department: { id: dept.id } }, order: { enqueuedAt: 'ASC' }, relations: ['visit', 'visit.patient'] });
  }

  async nextInQueue(departmentCode: string) {
    const q = await this.getQueue(departmentCode);
    if (!q || q.length === 0) return null;
    const entry = q[0];
    // mark visit active
    const active = await this.statusRepo.findOne({ where: { name: 'ACTIVE' } });
    entry.visit.status = active as any;
    await this.visitRepo.save(entry.visit);
    // remove queue entry
    await this.queueRepo.delete({ id: entry.id } as any);
    await this.eventBus.publish('VisitCreated', { visitId: entry.visit.id, at: new Date().toISOString() });
    return entry.visit;
  }

  async historyForPatient(patientId: string) {
    return this.visitRepo.find({ where: { patient: { id: patientId } }, order: { createdAt: 'DESC' }, relations: ['department', 'status'] });
  }
}
