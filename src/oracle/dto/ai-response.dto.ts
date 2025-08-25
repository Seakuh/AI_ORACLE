import { ApiProperty } from '@nestjs/swagger';

export class AIResponseDto {
  @ApiProperty({ description: 'Whether the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'The AI response content' })
  response: string;

  @ApiProperty({ description: 'The provider that was used' })
  provider: string;

  @ApiProperty({ description: 'Tokens used in the request' })
  tokensUsed?: number;

  @ApiProperty({ description: 'Request processing time in milliseconds' })
  processingTime: number;

  @ApiProperty({ description: 'Timestamp of the request' })
  timestamp: string;

  @ApiProperty({ description: 'Error message if request failed' })
  error?: string;
}