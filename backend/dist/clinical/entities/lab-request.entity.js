var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Consultation } from './consultation.entity';
import { User } from '../../auth/entities/user.entity';
let LabRequest = class LabRequest {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], LabRequest.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Consultation, { eager: true }),
    __metadata("design:type", Consultation)
], LabRequest.prototype, "consultation", void 0);
__decorate([
    ManyToOne(() => User, { eager: true }),
    __metadata("design:type", User)
], LabRequest.prototype, "requestedBy", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], LabRequest.prototype, "testName", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LabRequest.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], LabRequest.prototype, "createdAt", void 0);
LabRequest = __decorate([
    Entity({ name: 'lab_requests' })
], LabRequest);
export { LabRequest };
//# sourceMappingURL=lab-request.entity.js.map