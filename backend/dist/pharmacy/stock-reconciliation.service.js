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
var StockReconciliationService_1;
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { EventBusService } from '../auth/event-bus.service';
let StockReconciliationService = StockReconciliationService_1 = class StockReconciliationService {
    constructor(stockRepo, eventBus) {
        this.stockRepo = stockRepo;
        this.eventBus = eventBus;
        this.logger = new Logger(StockReconciliationService_1.name);
        this.lowStockThreshold = 5; // default, can be configurable
    }
    async runOnce() {
        this.logger.log('Running stock reconciliation');
        const low = await this.stockRepo.createQueryBuilder('s').leftJoinAndSelect('s.drug', 'd').where('s.quantity <= :th', { th: this.lowStockThreshold }).getMany();
        for (const s of low) {
            this.logger.warn(`Low stock detected for drug ${s.drug.id} qty=${s.quantity}`);
            this.eventBus.publish('LowStock', { drugId: s.drug.id, location: s.location, quantity: Number(s.quantity), detectedAt: new Date().toISOString() });
            await this.stockRepo.manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, ['LowStockDetected', JSON.stringify({ stockId: s.id, qty: s.quantity })]);
        }
        return low;
    }
};
StockReconciliationService = StockReconciliationService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Stock)),
    __metadata("design:paramtypes", [Repository, EventBusService])
], StockReconciliationService);
export { StockReconciliationService };
//# sourceMappingURL=stock-reconciliation.service.js.map