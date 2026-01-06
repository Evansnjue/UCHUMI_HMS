import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'hr_payroll' })
export class Payroll {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'period_start', type: 'date' }) periodStart: string;
  @Column({ name: 'period_end', type: 'date' }) periodEnd: string;
  @Column({ name: 'gross_pay', type: 'numeric', precision: 12, scale: 2 }) grossPay: number;
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 }) deductions: number;
  @Column({ name: 'net_pay', type: 'numeric', precision: 12, scale: 2 }) netPay: number;
  @Column({ default: false }) processed: boolean;
  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true }) processedAt?: Date;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
