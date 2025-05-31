import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import axios from 'axios';
import { Logger } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NotificationService', () => {
  let service: NotificationService;
  const originalEnv = process.env;

  beforeEach(async () => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.PUSH_URL = 'https://test-url.com';

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    // Silence the logger for cleaner test output
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendPushNotification', () => {
    it('should successfully send a push notification', async () => {
      // Arrange
      const userId = 'user123';
      const name = 'John Doe';
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

      // Act
      const result = await service.sendPushNotification(userId, name);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith('https://test-url.com', {
        userId,
        message: `Hello ${name}, it's time for your push notification! 🚀`,
      });
      expect(result).toEqual({
        success: true,
        message: 'Notification sent directly to user: John Doe',
      });
    });

    it('should handle errors when PUSH_URL is not defined', async () => {
      // Arrange
      const userId = 'user123';
      const name = 'John Doe';
      delete process.env.PUSH_URL;

      // Act
      const result = await service.sendPushNotification(userId, name);

      // Assert
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: 'Failed to send notification: PUSH_URL is not defined',
      });
    });

    it('should handle API errors', async () => {
      // Arrange
      const userId = 'user123';
      const name = 'John Doe';
      const error = new Error('API error');
      mockedAxios.post.mockRejectedValueOnce(error);

      // Act
      const result = await service.sendPushNotification(userId, name);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: 'Failed to send notification: API error',
      });
    });
  });
});
