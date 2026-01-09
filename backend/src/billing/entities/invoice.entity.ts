import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { BillingItem } from './billing-item.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, { nullable: true, onDelete: 'SET NULL' })
  patient: Patient;

  @Column({ type: 'numeric', default: 0 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  insuranceProvider: string;

  @Column({ type: 'numeric', default: 0 })
  insuranceCoveredAmount: number;

  @Column({ type: 'numeric', default: 0 })
  patientResponsible: number;

  @Column({ type: 'text', default: 'UNPAID' })
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';

  @OneToMany(() => BillingItem, (i) => i.invoice, { cascade: true, eager: true })
  items: BillingItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
