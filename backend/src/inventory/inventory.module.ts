import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryItem } from './entities/inventory-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Department } from './entities/department.entity';
import { EventBusService } from '../auth/event-bus.service';
import { InventoryEventsSubscriber } from './inventory.events.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, StockMovement, Department])],
  providers: [InventoryService, EventBusService, InventoryEventsSubscriber],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
