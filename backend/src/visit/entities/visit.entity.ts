import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { Department } from '../../patient/entities/department.entity';
import { VisitStatus } from './visit-status.entity';

@Entity({ name: 'visits' })
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Human-readable visit number, generated atomically
  @Column({ unique: true })
  visitNumber: string;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => VisitStatus, { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: VisitStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
