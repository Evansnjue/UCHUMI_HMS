import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'procurement_insurance_claims' })
export class InsuranceClaim {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'patient_id', nullable: true }) patientId?: string;
  @Column({ name: 'claim_number', unique: true }) claimNumber: string;
  @Column() insurer: string;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) amount: number;
  @Column() status: string; // SUBMITTED, APPROVED, REJECTED, PAID
  @Column({ name: 'submitted_by', nullable: true }) submittedBy?: string;
  @Column({ name: 'processed_by', nullable: true }) processedBy?: string;
  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true }) processedAt?: Date;
  @Column({ type: 'text', nullable: true }) notes?: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
