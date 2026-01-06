import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Invoice } from './entities/invoice.entity';
import { BillingItem } from './entities/billing-item.entity';
import { Payment } from './entities/payment.entity';
import { EventBusService } from '../auth/event-bus.service';
import { BillingEventsSubscriber } from './billing.events.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, BillingItem, Payment])],
  providers: [BillingService, EventBusService, BillingEventsSubscriber],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
