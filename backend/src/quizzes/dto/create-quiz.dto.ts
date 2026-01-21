import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CheckboxOptionDto {
  @IsString()
  @MinLength(1)
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class QuestionDto {
  @IsIn(['boolean', 'input', 'checkbox'])
  type: 'boolean' | 'input' | 'checkbox';

  @IsString()
  @MinLength(1)
  text: string;

  // boolean
  @IsOptional()
  @IsBoolean()
  correctBoolean?: boolean;

  // input
  @IsOptional()
  @IsString()
  @MinLength(1)
  correctText?: string;

  // checkbox
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CheckboxOptionDto)
  options?: CheckboxOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
