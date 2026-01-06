import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'hr_employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'employee_no', unique: true }) employeeNo: string;
  @Column({ name: 'first_name' }) firstName: string;
  @Column({ name: 'last_name' }) lastName: string;
  @Column({ unique: true }) email: string;
  @Column({ nullable: true }) phone?: string;
  @Column() role: string;
  @Column({ nullable: true }) department?: string;
  @Column({ type: 'date', name: 'hire_date' }) hireDate: string;
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 }) salary: number;
  @Column({ default: true }) active: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
