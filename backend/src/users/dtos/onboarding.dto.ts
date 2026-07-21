import { IsNotEmpty, IsNumber, IsString, IsDateString, Min, Max } from 'class-validator';

export class OnboardingDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(4.0)
  @Max(9.0)
  targetBand: number;

  @IsNotEmpty()
  @IsDateString()
  examDate: string;

  @IsNotEmpty()
  @IsString()
  goal: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(15)
  @Max(240)
  studyTimePerDay: number;
}
