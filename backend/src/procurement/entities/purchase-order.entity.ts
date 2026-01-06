import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity({ name: 'procurement_purchase_orders' })
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'created_by', nullable: true }) createdBy?: string;
  @Column({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2, default: 0 }) totalAmount: number;
  @Column({ default: 'USD' }) currency: string;
  @Column() status: string; // PENDING, APPROVED, REJECTED, RECEIVED
  @Column({ name: 'approved_by', nullable: true }) approvedBy?: string;
  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true }) approvedAt?: Date;

  @OneToMany(() => PurchaseOrderItem, (i) => i.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
