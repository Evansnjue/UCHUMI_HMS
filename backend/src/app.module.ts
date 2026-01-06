import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { VisitModule } from './visit/visit.module';
import { ClinicalModule } from './clinical/clinical.module';
import { LabModule } from './lab/lab.module';
import { BillingModule } from './billing/billing.module';
import { InventoryModule } from './inventory/inventory.module';
import { HRModule } from './hr/hr.module';

@Module({
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
export class AppModule {}
