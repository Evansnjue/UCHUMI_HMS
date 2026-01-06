import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class HRSubscriber {
  private readonly logger = new Logger(HRSubscriber.name);

  constructor(private eventBus: EventBusService) {
    this.eventBus.subscribe('EmployeeCheckedIn', this.onCheckedIn.bind(this));
    this.eventBus.subscribe('EmployeeOvertime', this.onOvertime.bind(this));
    this.eventBus.subscribe('PayrollProcessed', this.onPayrollProcessed.bind(this));
  }

  onCheckedIn(payload: any) {
    this.logger.log(`Employee checked in: ${payload.employeeId} attendance=${payload.attendanceId} status=${payload.status}`);
    // TODO: integrate notifications or time-tracking sync
  }

  onOvertime(payload: any) {
    this.logger.log(`Overtime recorded: ${payload.employeeId} overtime=${payload.overtimeSeconds}`);
    // TODO: push overtime to payroll or notify manager
  }

  onPayrollProcessed(payload: any) {
    this.logger.log(`Payroll processed: ${payload.payrollId} employee=${payload.employeeId} net=${payload.netPay}`);
    // TODO: trigger payment disbursement or ledger entries
  }
}
