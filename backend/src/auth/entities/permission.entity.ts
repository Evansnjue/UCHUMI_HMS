import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g. users.read, users.write, prescriptions.create

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Role, (r) => r.permissions)
  roles: Role[];
}
