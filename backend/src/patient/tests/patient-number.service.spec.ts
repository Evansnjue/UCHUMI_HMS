import { PatientNumberService } from '../patient-number.service';

describe('PatientNumberService', () => {
  it('generates formatted numbers without Redis (fallback)', async () => {
    process.env.REDIS_URL = '';
    const svc = new PatientNumberService();
    const n = await svc.generate('OPD');
    expect(n.startsWith('OPD-')).toBeTruthy();
  });
});
