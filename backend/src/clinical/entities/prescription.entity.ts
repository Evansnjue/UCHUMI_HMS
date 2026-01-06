import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Consultation } from './consultation.entity';
import { PrescriptionItem } from './prescription-item.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'prescriptions' })
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Consultation, { eager: true })
  consultation: Consultation;

  @ManyToOne(() => User, { eager: true })
  prescribedBy: User;

  @OneToMany(() => PrescriptionItem, (i) => i.prescription, { cascade: true, eager: true })
  items: PrescriptionItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
