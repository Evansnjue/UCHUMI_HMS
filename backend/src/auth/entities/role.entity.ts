import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g. Admin, Doctor, Receptionist, Pharmacist, HR

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (u) => u.roles)
  users: User[];

  @ManyToMany(() => Permission, (p) => p.roles, { cascade: true })
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
