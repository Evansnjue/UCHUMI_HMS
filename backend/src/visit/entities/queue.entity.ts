import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { Department } from '../../patient/entities/department.entity';
import { Visit } from './visit.entity';

@Entity({ name: 'queues' })
export class QueueEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Department, { eager: true })
  department: Department;

  @ManyToOne(() => Visit, { eager: true })
  visit: Visit;

  @Column({ type: 'int', nullable: true })
  position?: number; // optional cached position

  @CreateDateColumn({ type: 'timestamptz' })
  enqueuedAt: Date;
}
