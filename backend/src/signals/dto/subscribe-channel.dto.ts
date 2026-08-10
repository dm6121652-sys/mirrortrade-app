import { IsString, MinLength, MaxLength } from 'class-validator';

export class SubscribeChannelDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  channelIdentifier!: string; // @username, group name, or -100xxxxxxx id

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  displayName!: string;
}
