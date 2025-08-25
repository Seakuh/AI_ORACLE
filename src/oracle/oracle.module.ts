import { Module } from '@nestjs/common';
import { OracleController } from './oracle.controller';
import { AIProviderService } from './services/ai-provider.service';

@Module({
  controllers: [OracleController],
  providers: [AIProviderService],
  exports: [AIProviderService],
})
export class OracleModule {}