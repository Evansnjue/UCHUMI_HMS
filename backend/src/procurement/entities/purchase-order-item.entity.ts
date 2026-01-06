import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity({ name: 'procurement_purchase_order_items' })
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'text' }) description: string;
  @Column({ type: 'int' }) quantity: number;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) unitPrice: number;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) totalPrice: number;
}
