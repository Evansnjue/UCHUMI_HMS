import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ReportTemplate } from './report-template.entity';

@Entity({ name: 'reporting_reports' })
export class Report {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => ReportTemplate, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'template_id' })
  template?: ReportTemplate;

  @Column({ nullable: true }) name?: string;
  @Column({ nullable: true }) department?: string;
  @Column({ name: 'period_start', type: 'date' }) periodStart: string;
  @Column({ name: 'period_end', type: 'date' }) periodEnd: string;
  @Column() type: string; // DAILY | WEEKLY | MONTHLY
  @Column({ name: 'generated_by', nullable: true }) generatedBy?: string;
  @Column({ name: 'generated_at', type: 'timestamptz', nullable: true }) generatedAt?: Date;
  @Column({ type: 'jsonb' }) payload: any;
  @Column() status: string;
  @Column({ name: 'exported_to', nullable: true }) exportedTo?: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
