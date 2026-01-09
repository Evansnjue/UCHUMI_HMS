import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Department } from './department.entity';
import { Drug } from '../../clinical/entities/drug.entity';

/**
 * Inventory items represent tracked products in the central store.
 * - Batches & expiry dates are captured
 */
@Entity({ name: 'inventory_items' })
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  batch: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: string;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
  department: Department;

  @ManyToOne(() => Drug, { nullable: true, onDelete: 'SET NULL' })
  drug: Drug | null;

  @Column({ type: 'text', nullable: true })
  productType: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
