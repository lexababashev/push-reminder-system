import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { Logger, NotFoundException } from '@nestjs/common';
import { notificationQueue } from '../queue/notification.queue';

// Mock the notification queue
jest.mock('../queue/notification.queue', () => ({
  notificationQueue: {
    add: jest.fn(),
  },
}));

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Silence the logger for cleaner test output
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    
    // Mock the random ID generation to return a predictable value
    jest.spyOn(service as any, 'generateShortId').mockReturnValue('test123');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and add a notification to the queue', async () => {
      // Arrange
      const createUserDto = { name: 'John Doe' };
      const user = {
        id: 'test123',
        name: 'John Doe',
        createdAt: new Date(),
      };
      
      (prismaService.user.create as jest.Mock).mockResolvedValue(user);
      
      // Act
      const result = await service.create(createUserDto);
      
      // Assert
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: 'test123',
          ...createUserDto,
        },
      });
      expect(notificationQueue.add).toHaveBeenCalledWith(
        'send-push',
        {
          userId: 'test123',
          name: 'John Doe',
        },
        {
          delay: 24 * 60 * 60 * 1000,
          attempts: 2,
        }
      );
      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      // Arrange
      const userId = 'test123';
      const user = {
        id: userId,
        name: 'John Doe',
        createdAt: new Date(),
      };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      
      // Act
      const result = await service.findById(userId);
      
      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(user);
    });
    
    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      const userId = 'test123';
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user if found', async () => {
      // Arrange
      const userId = 'test123';
      const user = {
        id: userId,
        name: 'John Doe',
        createdAt: new Date(),
      };
      (prismaService.user.delete as jest.Mock).mockResolvedValue(user);
      
      // Act
      const result = await service.remove(userId);
      
      // Assert
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(user);
    });
    
    it('should throw NotFoundException if user not found during deletion', async () => {
      // Arrange
      const userId = 'test123';
      (prismaService.user.delete as jest.Mock).mockRejectedValue(new Error('User not found'));
      
      // Act & Assert
      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('generateShortId', () => {
    it('should generate a random ID of specified length', () => {
      // Reset the mock to test the actual implementation
      jest.spyOn(service as any, 'generateShortId').mockRestore();
      
      // Act
      const result = (service as any).generateShortId(10);
      
      // Assert
      expect(result).toHaveLength(10);
      expect(typeof result).toBe('string');
    });
  });
});
