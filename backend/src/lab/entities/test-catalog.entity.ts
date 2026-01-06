import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'test_catalog' })
export class TestCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // e.g., CBC, XRAY, LFT

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  defaultUnits?: string;
}
