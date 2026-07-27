import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class PlacementTestDto {
  @IsNotEmpty()
  @IsObject()
  grammarAnswers: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  vocabularyAnswers: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  listeningAnswers: Record<string, string>;

  @IsNotEmpty()
  @IsString()
  writingSubmission: string;
}
