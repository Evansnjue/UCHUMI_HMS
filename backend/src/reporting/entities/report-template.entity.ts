import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'reporting_templates' })
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() name: string;
  @Column({ nullable: true }) department?: string;
  @Column({ nullable: true, type: 'text' }) description?: string;

  // JSON object describing KPI definitions, e.g. { "patient_flow": { "type": "count", "source": "visits", ... } }
  @Column({ name: 'kpi_definitions', type: 'jsonb' }) kpiDefinitions: any;
  @Column({ name: 'default_params', type: 'jsonb', nullable: true }) defaultParams?: any;

  @Column({ name: 'created_by', nullable: true }) createdBy?: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
