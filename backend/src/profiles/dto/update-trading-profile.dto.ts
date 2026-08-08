import { ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsInt, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateTradingProfileDto {
  @IsBoolean()
  copyTradingEnabled!: boolean;

  @IsBoolean()
  killSwitchEnabled!: boolean;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  @Max(100)
  maxRiskPerTrade!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxDailyLoss!: number;

  @IsInt()
  @Min(1)
  @Max(100)
  maxOpenPositions!: number;

  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(20, { each: true })
  allowedSymbols!: string[];
}
