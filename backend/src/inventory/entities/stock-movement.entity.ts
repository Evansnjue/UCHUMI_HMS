import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { Department } from './department.entity';
import { User } from '../auth/entities/user.entity';

@Entity({ name: 'stock_movements' })
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem, { nullable: false, onDelete: 'CASCADE' })
  item: InventoryItem;

  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
  fromDepartment: Department;

  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
  toDepartment: Department;

  @Column({ type: 'numeric' })
  delta: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text' })
  type: 'ADD' | 'REMOVE' | 'TRANSFER';

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
