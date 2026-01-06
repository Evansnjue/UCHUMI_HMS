import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity({ name: 'billing_items' })
export class BillingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, (inv) => inv.items, { onDelete: 'CASCADE' })
  invoice: Invoice;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', default: 0 })
  unitPrice: number;

  @Column({ type: 'numeric', default: 0 })
  total: number;
}
