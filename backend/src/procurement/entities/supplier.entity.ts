import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'procurement_suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() name: string;
  @Column({ name: 'contact_name', nullable: true }) contactName?: string;
  @Column({ name: 'contact_email', nullable: true }) contactEmail?: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ type: 'text', nullable: true }) terms?: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
