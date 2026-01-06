import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabResult } from './entities/lab-result.entity';
import { TestCatalog } from './entities/test-catalog.entity';
import { LabService } from './lab.service';
import { LabController } from './lab.controller';
import { EventBusService } from '../auth/event-bus.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabResult, TestCatalog])],
  providers: [LabService, EventBusService],
  controllers: [LabController],
  exports: [LabService],
})
export class LabModule {}
