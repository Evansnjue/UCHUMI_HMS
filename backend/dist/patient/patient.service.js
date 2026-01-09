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
import { Patient } from './entities/patient.entity';
import { PatientNumber } from './entities/patient-number.entity';
import { Department } from './entities/department.entity';
import { PatientDepartment } from './entities/patient-department.entity';
import { EventBusService } from '../auth/event-bus.service';
let PatientService = class PatientService {
    constructor(patientRepo, numbersRepo, deptRepo, patientDeptRepo, eventBus) {
        this.patientRepo = patientRepo;
        this.numbersRepo = numbersRepo;
        this.deptRepo = deptRepo;
        this.patientDeptRepo = patientDeptRepo;
        this.eventBus = eventBus;
    }
    async create(dto) {
        // Basic creation with optional numbers and department assignments
        const patient = this.patientRepo.create(dto);
        // handle numbers if provided
        if (dto.numbers && dto.numbers.length > 0) {
            // ensure uniqueness of numbers
            for (const n of dto.numbers) {
                const exists = await this.numbersRepo.findOne({ where: { number: n.number } });
                if (exists)
                    throw new BadRequestException(`Number ${n.number} already in use`);
            }
            patient.numbers = dto.numbers.map((n) => this.numbersRepo.create({ type: n.type, number: n.number }));
        }
        // Departments
        if (dto.departments && dto.departments.length > 0) {
            patient.departments = [];
            for (const d of dto.departments) {
                const dept = await this.deptRepo.findOne({ where: { code: d.departmentCode } });
                if (!dept)
                    throw new BadRequestException(`Department ${d.departmentCode} not found`);
                patient.departments.push(this.patientDeptRepo.create({ department: dept }));
            }
        }
        const saved = await this.patientRepo.save(patient);
        await this.eventBus.publish('PatientRegistered', { patientId: saved.id, at: new Date().toISOString() });
        return saved;
    }
    async update(id, dto) {
        const patient = await this.patientRepo.findOne({ where: { id }, relations: ['numbers', 'departments', 'departments.department'] });
        if (!patient)
            throw new NotFoundException('Patient not found');
        Object.assign(patient, dto);
        // handle numbers updates if provided
        if (dto.numbers) {
            // ensure provided numbers are not used by other patients
            for (const n of dto.numbers) {
                const exists = await this.numbersRepo.findOne({ where: { number: n.number } });
                if (exists && exists.patient.id !== patient.id)
                    throw new BadRequestException(`Number ${n.number} already in use`);
            }
            patient.numbers = dto.numbers.map((n) => this.numbersRepo.create({ type: n.type, number: n.number }));
        }
        // handle department updates
        if (dto.departments) {
            patient.departments = [];
            for (const d of dto.departments) {
                const dept = await this.deptRepo.findOne({ where: { code: d.departmentCode } });
                if (!dept)
                    throw new BadRequestException(`Department ${d.departmentCode} not found`);
                patient.departments.push(this.patientDeptRepo.create({ department: dept }));
            }
        }
        const saved = await this.patientRepo.save(patient);
        await this.eventBus.publish('PatientUpdated', { patientId: saved.id, at: new Date().toISOString() });
        return saved;
    }
    async findById(id) {
        return this.patientRepo.findOne({ where: { id }, relations: ['numbers', 'departments', 'departments.department'] });
    }
    async search(query, department) {
        const qb = this.patientRepo.createQueryBuilder('p').leftJoinAndSelect('p.numbers', 'n').leftJoinAndSelect('p.departments', 'pd').leftJoinAndSelect('pd.department', 'd');
        if (query) {
            qb.andWhere('(p.firstName ILIKE :q OR p.lastName ILIKE :q OR n.number ILIKE :q)', { q: `%${query}%` });
        }
        if (department) {
            qb.andWhere('d.code = :dept', { dept: department });
        }
        return qb.getMany();
    }
};
PatientService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Patient)),
    __param(1, InjectRepository(PatientNumber)),
    __param(2, InjectRepository(Department)),
    __param(3, InjectRepository(PatientDepartment)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        EventBusService])
], PatientService);
export { PatientService };
//# sourceMappingURL=patient.service.js.map