import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity({ name: 'patient_numbers' })
export class PatientNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  type: 'OPD' | 'IPD';

  @Column({ type: 'text', unique: true })
  number: string;

  @ManyToOne(() => Patient, (p) => p.numbers, { onDelete: 'CASCADE' })
  patient: Patient;

  @CreateDateColumn({ type: 'timestamptz' })
  assignedAt: Date;
}
