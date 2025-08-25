import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
}

export class AIRequestDto {
  @ApiProperty({ description: 'The AI provider to use' })
  @IsEnum(AIProvider)
  @IsNotEmpty()
  provider: AIProvider;

  @ApiProperty({ description: 'The prompt/question for the AI' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: 'System message for the AI', required: false })
  @IsString()
  @IsOptional()
  systemMessage?: string;

  @ApiProperty({ description: 'Maximum tokens for the response', required: false })
  @IsOptional()
  maxTokens?: number;

  @ApiProperty({ description: 'Temperature for response randomness', required: false })
  @IsOptional()
  temperature?: number;

  @ApiProperty({ description: 'Application identifier making the request', required: false })
  @IsString()
  @IsOptional()
  appId?: string;

  @ApiProperty({ description: 'Additional context or metadata', required: false })
  @IsOptional()
  context?: any;
}