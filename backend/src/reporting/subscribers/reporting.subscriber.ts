import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class ReportingSubscriber {
  private readonly logger = new Logger(ReportingSubscriber.name);

  constructor(private eventBus: EventBusService) {
    this.eventBus.subscribe('ReportGenerated', this.onReportGenerated.bind(this));
  }

  onReportGenerated(payload: any) {
    this.logger.log(`Report generated: ${payload.reportId} (template=${payload.templateId})`);
    // TODO: enqueue export job, notify stakeholders, cache aggregated KPIs
  }
}
