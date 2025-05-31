import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = { name: 'John Doe' };
      const expectedResult = {
        id: 'abc123',
        name: 'John Doe',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      // Arrange
      const userId = 'abc123';
      const expectedResult = {
        id: userId,
        name: 'John Doe',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findById(userId);

      // Assert
      expect(service.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      const userId = 'abc123';
      const deletedUser = {
        id: userId,
        name: 'John Doe',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'remove').mockResolvedValue(deletedUser);

      // Act
      await controller.remove(userId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });
});
