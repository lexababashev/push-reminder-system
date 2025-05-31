import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../services/notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            sendPushNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendPushNotification', () => {
    it('should call service.sendPushNotification with correct parameters', async () => {
      // Arrange
      const dto = { userId: 'user123', name: 'John Doe' };
      const expectedResult = {
        success: true,
        message: 'Notification sent directly to user: John Doe',
      };
      jest.spyOn(service, 'sendPushNotification').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.sendPushNotification(dto);

      // Assert
      expect(service.sendPushNotification).toHaveBeenCalledWith('user123', 'John Doe');
      expect(result).toEqual(expectedResult);
    });
  });
});
