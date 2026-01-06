import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DrugCategory } from './drug-category.entity';

@Entity({ name: 'drugs' })
export class Drug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => DrugCategory, (c) => c.drugs, { eager: true })
  category: DrugCategory;

  @Column({ nullable: true })
  description?: string;
}
