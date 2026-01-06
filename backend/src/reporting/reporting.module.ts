import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportTemplate } from './entities/report-template.entity';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { ReportingSubscriber } from './subscribers/reporting.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportTemplate])],
  providers: [ReportingService, ReportingSubscriber],
  controllers: [ReportingController],
  exports: [ReportingService],
})
export class ReportingModule {}
