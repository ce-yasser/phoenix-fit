import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersService as SharedUsersService } from '../../../shared/services/users/users.service';

describe('Admin UsersService', () => {
  let service: UsersService;
  const mockSharedUsersService = {
    findAll: jest.fn(),
    getUserById: jest.fn(),
    updateUserById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: SharedUsersService,
          useValue: mockSharedUsersService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all users', async () => {
    const users = [{ id: 1, email: 'user@example.com', role: 'USER' }];
    mockSharedUsersService.findAll.mockResolvedValue(users);

    await expect(service.getAllUsers()).resolves.toEqual({ data: users });
    expect(mockSharedUsersService.findAll).toHaveBeenCalled();
  });

  it('should update a user role', async () => {
    const updatedUser = { id: 1, email: 'user@example.com', role: 'ADMIN' };
    mockSharedUsersService.getUserById.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      role: 'USER',
    });
    mockSharedUsersService.updateUserById.mockResolvedValue(updatedUser);

    await expect(service.updateUserRole('1', 'ADMIN')).resolves.toEqual({
      data: updatedUser,
    });
    expect(mockSharedUsersService.updateUserById).toHaveBeenCalledWith(1, {
      role: 'ADMIN',
    });
  });
});
