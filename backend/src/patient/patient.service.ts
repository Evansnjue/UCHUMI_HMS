import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientNumber } from './entities/patient-number.entity';
import { Department } from './entities/department.entity';
import { PatientDepartment } from './entities/patient-department.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(PatientNumber) private numbersRepo: Repository<PatientNumber>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    @InjectRepository(PatientDepartment) private patientDeptRepo: Repository<PatientDepartment>,
    private eventBus: EventBusService,
  ) {}

  async create(dto: CreatePatientDto) {
    // Basic creation with optional numbers and department assignments
    const patient: Patient = this.patientRepo.create(dto as any) as unknown as Patient;

    // handle numbers if provided
    if (dto.numbers && dto.numbers.length > 0) {
      // ensure uniqueness of numbers
      for (const n of dto.numbers) {
        const exists = await this.numbersRepo.findOne({ where: { number: n.number } });
        if (exists) throw new BadRequestException(`Number ${n.number} already in use`);
      }
      patient.numbers = [];
      for (const n of dto.numbers) {
        const num = this.numbersRepo.create({ type: n.type, number: n.number } as any) as unknown as PatientNumber;
        patient.numbers.push(num);
      }
    }

    // Departments
    if (dto.departments && dto.departments.length > 0) {
      patient.departments = [];
      for (const d of dto.departments) {
        const dept = await this.deptRepo.findOne({ where: { code: d.departmentCode } });
        if (!dept) throw new BadRequestException(`Department ${d.departmentCode} not found`);
        const pd = this.patientDeptRepo.create({ department: dept } as any) as unknown as PatientDepartment;
        patient.departments.push(pd);
      }
    }

    const saved = await this.patientRepo.save(patient);

    await this.eventBus.publish('PatientRegistered', { patientId: saved.id, at: new Date().toISOString() });
    return saved;
  }

  async update(id: string, dto: UpdatePatientDto) {
    const patient: Patient | null = await this.patientRepo.findOne({ where: { id }, relations: ['numbers', 'departments', 'departments.department'] });
    if (!patient) throw new NotFoundException('Patient not found');

    Object.assign(patient, dto);

    // handle numbers updates if provided
    if (dto.numbers) {
      // ensure provided numbers are not used by other patients
      for (const n of dto.numbers) {
        const exists = await this.numbersRepo.findOne({ where: { number: n.number } });
        if (exists && exists.patient.id !== patient.id) throw new BadRequestException(`Number ${n.number} already in use`);
      }
      patient.numbers = [];
      for (const n of dto.numbers) {
        const num = this.numbersRepo.create({ type: n.type, number: n.number } as any) as unknown as PatientNumber;
        patient.numbers.push(num);
      }
    }

    // handle department updates
    if (dto.departments) {
      patient.departments = [];
      for (const d of dto.departments) {
        const dept = await this.deptRepo.findOne({ where: { code: d.departmentCode } });
        if (!dept) throw new BadRequestException(`Department ${d.departmentCode} not found`);
        const pd = this.patientDeptRepo.create({ department: dept } as any) as unknown as PatientDepartment;
        patient.departments.push(pd);
      }
    }

    const saved = await this.patientRepo.save(patient);
    await this.eventBus.publish('PatientUpdated', { patientId: saved.id, at: new Date().toISOString() });
    return saved;
  }

  async findById(id: string) {
    return this.patientRepo.findOne({ where: { id }, relations: ['numbers', 'departments', 'departments.department'] });
  }

  async search(query?: string, department?: string) {
    const qb = this.patientRepo.createQueryBuilder('p').leftJoinAndSelect('p.numbers', 'n').leftJoinAndSelect('p.departments', 'pd').leftJoinAndSelect('pd.department', 'd');
    if (query) {
      qb.andWhere('(p.firstName ILIKE :q OR p.lastName ILIKE :q OR n.number ILIKE :q)', { q: `%${query}%` });
    }
    if (department) {
      qb.andWhere('d.code = :dept', { dept: department });
    }
    return qb.getMany();
  }
}
