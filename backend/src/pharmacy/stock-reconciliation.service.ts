import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class StockReconciliationService {
  private readonly logger = new Logger(StockReconciliationService.name);
  private lowStockThreshold = 5; // default, can be configurable

  constructor(@InjectRepository(Stock) private stockRepo: Repository<Stock>, private eventBus: EventBusService) {}

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
}
