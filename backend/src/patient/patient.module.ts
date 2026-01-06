import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientNumber } from './entities/patient-number.entity';
import { Department } from './entities/department.entity';
import { PatientDepartment } from './entities/patient-department.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { EventBusService } from '../auth/event-bus.service';
import { PatientNumberService } from './patient-number.service';
import { PatientNumberController } from './patient-number.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientNumber, Department, PatientDepartment])],
  providers: [PatientService, EventBusService, PatientNumberService],
  controllers: [PatientController, PatientNumberController],
  exports: [PatientService, PatientNumberService],
})
export class PatientModule {}
