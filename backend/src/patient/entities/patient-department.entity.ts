import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Department } from './department.entity';

@Entity({ name: 'patient_departments' })
export class PatientDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (p) => p.departments, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => Department, (d) => d.patientAssignments, { eager: true, onDelete: 'CASCADE' })
  department: Department;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  assignedAt: Date;
}
