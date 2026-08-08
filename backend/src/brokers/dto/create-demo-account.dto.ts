import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDemoAccountDto {
  @IsIn(['deriv_mt5'])
  broker!: 'deriv_mt5';

  @IsString()
  @MinLength(3)
  @MaxLength(128)
  accountReference!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(4096)
  apiToken!: string;
}
