import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, UpdateDateColumn } from 'typeorm';
import { Drug } from '../../clinical/entities/drug.entity';

/**
 * Stock entity tracks the central inventory for drugs.
 * - Use 'location' to support multi-store inventories (central, satellite)
 */
@Entity({ name: 'stock' })
@Index(['drug', 'location'], { unique: true })
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Drug, { nullable: false, onDelete: 'CASCADE' })
  drug: Drug;

  @Column({ type: 'text', default: 'central' })
  location: string;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
