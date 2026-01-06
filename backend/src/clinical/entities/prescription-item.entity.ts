import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Prescription } from './prescription.entity';
import { Drug } from './drug.entity';

@Entity({ name: 'prescription_items' })
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  prescription: Prescription;

  @ManyToOne(() => Drug, { eager: true })
  drug: Drug;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  instructions?: string;
}
