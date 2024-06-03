import { UsersIdGuard } from './usersId.guard';

describe('UsersIdGuard', () => {
  it('should be defined', () => {
    expect(new UsersIdGuard()).toBeDefined();
  });
});
