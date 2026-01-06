import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { EventBusService } from '../auth/event-bus.service';
import { StockUpdatedEvent } from './events/pharmacy.events';

@Injectable()
export class PharmacyStockService {
  private readonly logger = new Logger(PharmacyStockService.name);

  constructor(@InjectRepository(Stock) private stockRepo: Repository<Stock>, private eventBus: EventBusService) {}

  async list(limit = 100, offset = 0) {
    return this.stockRepo.find({ take: limit, skip: offset, relations: ['drug'] });
  }

  /**
   * Adjust stock quantity by delta (positive to add, negative to remove)
   */
  async adjustStock(stockId: string, delta: number, reason: string, performedBy: string) {
    const stock = await this.stockRepo.findOne({ where: { id: stockId }, relations: ['drug'] });
    if (!stock) throw new Error('Stock not found');

    const oldQty = Number(stock.quantity);
    const newQty = oldQty + Number(delta);
    stock.quantity = newQty as any;
    await this.stockRepo.save(stock);

    const evt: StockUpdatedEvent = {
      drugId: stock.drug.id,
      location: stock.location,
      oldQuantity: oldQty,
      newQuantity: newQty,
      updatedAt: new Date().toISOString(),
    };

    this.eventBus.publish('StockUpdated', evt);

    // persist audit
    await this.stockRepo.manager.query(`INSERT INTO pharmacy_audit(event_type, payload) VALUES ($1,$2)`, [
      'StockAdjusted',
      JSON.stringify({ stockId, delta, reason, performedBy }),
    ]);

    return stock;
  }
}
