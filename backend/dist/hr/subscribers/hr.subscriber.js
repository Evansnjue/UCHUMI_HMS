var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HRSubscriber_1;
var _a;
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';
let HRSubscriber = HRSubscriber_1 = class HRSubscriber {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.logger = new Logger(HRSubscriber_1.name);
        this.eventBus.subscribe('EmployeeCheckedIn', this.onCheckedIn.bind(this));
        this.eventBus.subscribe('EmployeeOvertime', this.onOvertime.bind(this));
        this.eventBus.subscribe('PayrollProcessed', this.onPayrollProcessed.bind(this));
    }
    onCheckedIn(payload) {
        this.logger.log(`Employee checked in: ${payload.employeeId} attendance=${payload.attendanceId} status=${payload.status}`);
        // TODO: integrate notifications or time-tracking sync
    }
    onOvertime(payload) {
        this.logger.log(`Overtime recorded: ${payload.employeeId} overtime=${payload.overtimeSeconds}`);
        // TODO: push overtime to payroll or notify manager
    }
    onPayrollProcessed(payload) {
        this.logger.log(`Payroll processed: ${payload.payrollId} employee=${payload.employeeId} net=${payload.netPay}`);
        // TODO: trigger payment disbursement or ledger entries
    }
};
HRSubscriber = HRSubscriber_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof EventBusService !== "undefined" && EventBusService) === "function" ? _a : Object])
], HRSubscriber);
export { HRSubscriber };
//# sourceMappingURL=hr.subscriber.js.map