import { IsNotEmpty, IsString } from 'class-validator'

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsString()
  name: string
}
