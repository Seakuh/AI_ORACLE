import { Module } from "@nestjs/common";
import { OracleController } from "./oracle.controller";
import { AIProviderService } from "./services/ai-provider.service";
import { LatexAIService } from "./services/latex-ai.service";

@Module({
  controllers: [OracleController],
  providers: [AIProviderService, LatexAIService],
  exports: [AIProviderService],
})
export class OracleModule {}
