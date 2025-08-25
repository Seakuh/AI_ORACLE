import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AIProvider, AIRequestDto } from '../dto/ai-request.dto';

@Injectable()
export class AIProviderService {
  private readonly logger = new Logger(AIProviderService.name);

  constructor(private configService: ConfigService) {}

  async makeAIRequest(requestDto: AIRequestDto): Promise<any> {
    const startTime = Date.now();
    
    try {
      let response;
      
      switch (requestDto.provider) {
        case AIProvider.OPENAI:
          response = await this.callOpenAI(requestDto);
          break;
        case AIProvider.ANTHROPIC:
          response = await this.callAnthropic(requestDto);
          break;
        case AIProvider.GOOGLE:
          response = await this.callGoogle(requestDto);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${requestDto.provider}`);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        response: response.content,
        provider: requestDto.provider,
        tokensUsed: response.tokensUsed,
        processingTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`AI request failed: ${error.message}`, error.stack);
      
      return {
        success: false,
        response: '',
        provider: requestDto.provider,
        processingTime,
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  private async callOpenAI(requestDto: AIRequestDto): Promise<any> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [];
    if (requestDto.systemMessage) {
      messages.push({ role: 'system', content: requestDto.systemMessage });
    }
    messages.push({ role: 'user', content: requestDto.prompt });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        max_tokens: requestDto.maxTokens || 1000,
        temperature: requestDto.temperature || 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokensUsed: response.data.usage.total_tokens,
    };
  }

  private async callAnthropic(requestDto: AIRequestDto): Promise<any> {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: requestDto.maxTokens || 1000,
        system: requestDto.systemMessage || '',
        messages: [
          { role: 'user', content: requestDto.prompt }
        ],
        temperature: requestDto.temperature || 0.7,
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
      }
    );

    return {
      content: response.data.content[0].text,
      tokensUsed: response.data.usage.input_tokens + response.data.usage.output_tokens,
    };
  }

  private async callGoogle(requestDto: AIRequestDto): Promise<any> {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    const prompt = requestDto.systemMessage 
      ? `${requestDto.systemMessage}\n\n${requestDto.prompt}`
      : requestDto.prompt;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: requestDto.temperature || 0.7,
          maxOutputTokens: requestDto.maxTokens || 1000,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text,
      tokensUsed: response.data.usageMetadata?.totalTokenCount || 0,
    };
  }
}