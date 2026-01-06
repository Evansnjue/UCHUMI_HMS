import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'visit_status' })
export class VisitStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., QUEUED, ACTIVE, COMPLETED, CANCELLED

  @Column({ nullable: true })
  description?: string;
}
