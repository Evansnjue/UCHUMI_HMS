var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
let VisitNumberService = class VisitNumberService {
    constructor() {
        this.redis = null;
        const url = process.env.REDIS_URL || null;
        if (url)
            this.redis = new Redis(url);
    }
    /**
     * Generate a visit number for a given department and type (OPD/IPD). Uses Redis INCR for atomic counters per-department.
     */
    async generate(departmentCode, type) {
        const key = `counters:visit:${departmentCode}:${type}`;
        if (!this.redis)
            return `${departmentCode}-${type}-${Date.now()}`;
        const n = await this.redis.incr(key);
        return `${departmentCode}-${type}-${String(n).padStart(5, '0')}`;
    }
};
VisitNumberService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], VisitNumberService);
export { VisitNumberService };
//# sourceMappingURL=visit-number.service.js.map