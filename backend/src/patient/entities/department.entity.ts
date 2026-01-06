import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PatientDepartment } from './patient-department.entity';

@Entity({ name: 'departments' })
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => PatientDepartment, (pd) => pd.department)
  patientAssignments: PatientDepartment[];
}
