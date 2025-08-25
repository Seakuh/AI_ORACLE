import { HttpException, HttpStatus } from '@nestjs/common';

export class AIProviderException extends HttpException {
  constructor(provider: string, message: string) {
    super(`AI Provider Error (${provider}): ${message}`, HttpStatus.BAD_GATEWAY);
  }
}

export class APIKeyMissingException extends HttpException {
  constructor(provider: string) {
    super(`API key missing for provider: ${provider}`, HttpStatus.UNAUTHORIZED);
  }
}

export class RateLimitException extends HttpException {
  constructor(provider: string) {
    super(`Rate limit exceeded for provider: ${provider}`, HttpStatus.TOO_MANY_REQUESTS);
  }
}