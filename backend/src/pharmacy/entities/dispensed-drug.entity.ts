import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { PrescriptionItem } from '../../clinical/entities/prescription-item.entity';
import { Prescription } from '../../clinical/entities/prescription.entity';
import { Drug } from '../../clinical/entities/drug.entity';
import { User } from '../../auth/entities/user.entity';

/**
 * Records actual dispenses performed by pharmacists. Each row references the
 * prescription item and the pharmacist who dispensed it.
 */
@Entity({ name: 'dispensed_drugs' })
export class DispensedDrug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PrescriptionItem, { nullable: false, onDelete: 'CASCADE' })
  prescriptionItem: PrescriptionItem;

  @ManyToOne(() => Prescription, { nullable: false, onDelete: 'CASCADE' })
  prescription: Prescription;

  @ManyToOne(() => Drug, { nullable: false, onDelete: 'CASCADE' })
  drug: Drug;

  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' })
  pharmacist: User;

  @Column({ type: 'numeric' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  unit: string;

  @CreateDateColumn({ type: 'timestamptz' })
  dispensedAt: Date;
}
