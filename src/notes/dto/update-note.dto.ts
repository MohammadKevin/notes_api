import { IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;
}
