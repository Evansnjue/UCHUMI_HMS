import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { InMemoryEventBus } from '../event-bus/in-memory-event-bus';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('AuthService events', () => {
  it('publishes UserLoggedIn on login', async () => {
    const inMemoryBus = new InMemoryEventBus();
    const fakeUser = { id: '123', roles: [] } as any;
    const moduleRef = await Test.createTestingModule({ providers: [AuthService, { provide: InMemoryEventBus, useValue: inMemoryBus }, { provide: getRepositoryToken(User), useValue: {} }] }).compile();
    const svc = moduleRef.get(AuthService);
    // Call login directly
    const res = await svc.login(fakeUser);
    expect(inMemoryBus.events.some((e) => e.name === 'UserLoggedIn')).toBeTruthy();
  });
});
