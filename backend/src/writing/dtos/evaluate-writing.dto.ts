import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export class EvaluateWritingDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsNotEmpty()
  @IsString()
  submission: string;

  @IsNotEmpty()
  @IsEnum(['writing_task_1', 'writing_task_2'])
  taskType: 'writing_task_1' | 'writing_task_2';

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  durationSeconds: number;
}
