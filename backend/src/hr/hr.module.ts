import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { Payroll } from './entities/payroll.entity';
import { HRService } from './hr.service';
import { HRController } from './hr.controller';
import { HRSubscriber } from './subscribers/hr.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Attendance, Payroll])],
  providers: [HRService, HRSubscriber],
  controllers: [HRController],
  exports: [HRService],
})
export class HRModule {}
