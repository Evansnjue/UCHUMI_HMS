import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Drug } from './drug.entity';

@Entity({ name: 'drug_categories' })
export class DrugCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int', default: 0 })
  dailyLimit: number; // default 0 = no limit

  @OneToMany(() => Drug, (d) => d.category)
  drugs: Drug[];
}
