import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { QueueEntry } from './entities/queue.entity';
import { VisitStatus } from './entities/visit-status.entity';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { VisitNumberService } from './visit-number.service';
import { EventBusService } from '../auth/event-bus.service';
import { Patient } from '../patient/entities/patient.entity';
import { Department } from '../patient/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visit, QueueEntry, VisitStatus, Patient, Department])],
  providers: [VisitService, VisitNumberService, EventBusService],
  controllers: [VisitController],
  exports: [VisitService],
})
export class VisitModule {}
