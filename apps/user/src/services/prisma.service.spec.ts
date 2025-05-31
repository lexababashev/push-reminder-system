import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    
    // Mock the Prisma client methods
    service.$connect = jest.fn();
    service.$disconnect = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      // Act
      await service.onModuleInit();
      
      // Assert
      expect(service.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      // Act
      await service.onModuleDestroy();
      
      // Assert
      expect(service.$disconnect).toHaveBeenCalled();
    });
  });
});
