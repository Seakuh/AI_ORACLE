import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AIRequestDto } from "./dto/ai-request.dto";
import { AIResponseDto } from "./dto/ai-response.dto";
import { AIProviderService } from "./services/ai-provider.service";

@ApiTags("AI Oracle")
@Controller("oracle")
export class OracleController {
  private readonly logger = new Logger(OracleController.name);

  constructor(private readonly aiProviderService: AIProviderService) {}

  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  healthCheck() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "AI Oracle",
      version: "1.0.0",
    };
  }

  @Get("providers")
  @ApiOperation({ summary: "Get available AI providers" })
  @ApiResponse({ status: 200, description: "List of available providers" })
  getProviders() {
    return {
      providers: ["openai", "anthropic", "google"],
      description: "Available AI providers for requests",
    };
  }

  @Post("ask")
  @ApiOperation({ summary: "Make an AI request" })
  @ApiResponse({ status: 200, description: "AI response", type: AIResponseDto })
  @ApiResponse({ status: 400, description: "Invalid request" })
  async askAI(@Body() requestDto: AIRequestDto): Promise<AIResponseDto> {
    this.logger.log(
      `AI request received: ${requestDto.provider} from app: ${
        requestDto.appId || "unknown"
      }`
    );

    const response = await this.aiProviderService.makeAIRequest(requestDto);

    if (response.success) {
      this.logger.log(
        `AI request completed successfully in ${response.processingTime}ms`
      );
    } else {
      this.logger.error(`AI request failed: ${response.error}`);
    }

    return response;
  }

  @Post("batch")
  @ApiOperation({ summary: "Make multiple AI requests" })
  @ApiResponse({ status: 200, description: "Batch AI responses" })
  async batchAskAI(@Body() requests: AIRequestDto[]): Promise<AIResponseDto[]> {
    this.logger.log(`Batch AI request received: ${requests.length} requests`);

    const promises = requests.map((request) =>
      this.aiProviderService.makeAIRequest(request)
    );

    const responses = await Promise.all(promises);

    this.logger.log(
      `Batch AI request completed: ${
        responses.filter((r) => r.success).length
      }/${responses.length} successful`
    );

    return responses;
  }
}
