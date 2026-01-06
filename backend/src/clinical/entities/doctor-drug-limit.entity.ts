import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { DrugCategory } from './drug-category.entity';

@Entity({ name: 'doctor_drug_limits' })
export class DoctorDrugLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  doctor: User;

  @ManyToOne(() => DrugCategory, { eager: true })
  category: DrugCategory;

  @Column({ type: 'int', default: 0 })
  dailyLimit: number;
}
