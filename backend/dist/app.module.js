var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { VisitModule } from './visit/visit.module';
import { ClinicalModule } from './clinical/clinical.module';
import { LabModule } from './lab/lab.module';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({ isGlobal: true }),
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASS || 'postgres',
                database: process.env.DB_NAME || 'uchumi_test',
                autoLoadEntities: true,
                synchronize: false /* use migrations in production */,
            }),
            AuthModule,
            // Patient module
            PatientModule,
            VisitModule,
            ClinicalModule,
            // Lab module
            LabModule,
            // Billing & Inventory
            (await import('./billing/billing.module')).BillingModule,
            (await import('./inventory/inventory.module')).InventoryModule,
            (await import('./hr/hr.module')).HRModule,
            (await import('./reporting/reporting.module')).ReportingModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map