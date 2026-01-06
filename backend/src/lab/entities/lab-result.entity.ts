import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { TestCatalog } from './test-catalog.entity';
import { LabRequest } from '../../clinical/entities/lab-request.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'lab_results' })
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LabRequest, { eager: true })
  labRequest: LabRequest;

  @ManyToOne(() => TestCatalog, { eager: true })
  test: TestCatalog;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true })
  units?: string;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'AMENDED';

  @ManyToOne(() => User, { eager: true })
  enteredBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
