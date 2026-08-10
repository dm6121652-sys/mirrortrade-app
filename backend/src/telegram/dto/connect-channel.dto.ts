import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectChannelDto {
  @IsString()
  @IsNotEmpty()
  channel_identifier!: string;
}
