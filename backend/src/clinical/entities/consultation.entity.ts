import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'consultations' })
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @ManyToOne(() => User, { eager: true })
  doctor: User;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
