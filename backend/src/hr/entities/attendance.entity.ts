import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'hr_attendance' })
export class Attendance {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'check_in', type: 'timestamptz' }) checkIn: Date;
  @Column({ name: 'check_out', type: 'timestamptz', nullable: true }) checkOut?: Date;
  @Column({ name: 'shift_date', type: 'date' }) shiftDate: string;
  @Column() status: string;
  @Column({ name: 'overtime_seconds', type: 'int', default: 0 }) overtimeSeconds: number;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
