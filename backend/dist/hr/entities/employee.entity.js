var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
let Employee = class Employee {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    Column({ name: 'employee_no', unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeNo", void 0);
__decorate([
    Column({ name: 'first_name' }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    Column({ name: 'last_name' }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "phone", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "role", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "department", void 0);
__decorate([
    Column({ type: 'date', name: 'hire_date' }),
    __metadata("design:type", String)
], Employee.prototype, "hireDate", void 0);
__decorate([
    Column({ type: 'numeric', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Employee.prototype, "salary", void 0);
__decorate([
    Column({ default: true }),
    __metadata("design:type", Boolean)
], Employee.prototype, "active", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
Employee = __decorate([
    Entity({ name: 'hr_employees' })
], Employee);
export { Employee };
//# sourceMappingURL=employee.entity.js.map