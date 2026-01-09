var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportingSubscriber_1;
var _a;
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';
let ReportingSubscriber = ReportingSubscriber_1 = class ReportingSubscriber {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.logger = new Logger(ReportingSubscriber_1.name);
        this.eventBus.subscribe('ReportGenerated', this.onReportGenerated.bind(this));
    }
    onReportGenerated(payload) {
        this.logger.log(`Report generated: ${payload.reportId} (template=${payload.templateId})`);
        // TODO: enqueue export job, notify stakeholders, cache aggregated KPIs
    }
};
ReportingSubscriber = ReportingSubscriber_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof EventBusService !== "undefined" && EventBusService) === "function" ? _a : Object])
], ReportingSubscriber);
export { ReportingSubscriber };
//# sourceMappingURL=reporting.subscriber.js.map