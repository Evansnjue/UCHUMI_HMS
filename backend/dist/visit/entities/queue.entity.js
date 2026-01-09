var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { Department } from '../../patient/entities/department.entity';
import { Visit } from './visit.entity';
let QueueEntry = class QueueEntry {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], QueueEntry.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Department, { eager: true }),
    __metadata("design:type", Department)
], QueueEntry.prototype, "department", void 0);
__decorate([
    ManyToOne(() => Visit, { eager: true }),
    __metadata("design:type", Visit)
], QueueEntry.prototype, "visit", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], QueueEntry.prototype, "position", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], QueueEntry.prototype, "enqueuedAt", void 0);
QueueEntry = __decorate([
    Entity({ name: 'queues' })
], QueueEntry);
export { QueueEntry };
//# sourceMappingURL=queue.entity.js.map