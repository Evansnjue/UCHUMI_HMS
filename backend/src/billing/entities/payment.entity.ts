import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, { nullable: false, onDelete: 'CASCADE' })
  invoice: Invoice;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'text' })
  method: string; // CASH | MOBILE_MONEY | INSURANCE

  @Column({ type: 'text', nullable: true })
  provider: string;

  @Column({ type: 'text', nullable: true })
  reference: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  receivedBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  receivedAt: Date;
}
