import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Consultation } from './consultation.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'lab_requests' })
export class LabRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Consultation, { eager: true })
  consultation: Consultation;

  @ManyToOne(() => User, { eager: true })
  requestedBy: User;

  @Column({ type: 'text' })
  testName: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
