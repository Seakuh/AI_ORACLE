# AI Oracle Backend

Ein NestJS Backend-Service, der als zentraler AI Oracle für alle deine Anwendungen fungiert. Ermöglicht es verschiedenen Applikationen, AI-Requests an verschiedene Provider zu senden.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic (Claude), Google AI
- **REST API**: Einfache HTTP-Endpoints für AI-Requests
- **Batch Requests**: Mehrere AI-Requests gleichzeitig verarbeiten
- **Swagger Documentation**: Automatische API-Dokumentation
- **Error Handling**: Umfassende Fehlerbehandlung und Logging
- **Validation**: Input-Validierung mit class-validator
- **CORS Support**: Für Frontend-Integration

## Installation

1. Repository klonen und Dependencies installieren:
```bash
npm install
```

2. Environment-Variablen konfigurieren:
```bash
cp .env.example .env
```

3. API Keys in `.env` eintragen:
```bash
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
PORT=3000
```

## Verwendung

### Development starten:
```bash
npm run start:dev
```

### Production Build:
```bash
npm run build
npm start
```

### Mit Watch Mode:
```bash
npm run start:watch
```

## API Endpoints

### Health Check
```
GET /oracle/health
```

### Verfügbare Provider
```
GET /oracle/providers
```

### AI Request
```
POST /oracle/ask
Content-Type: application/json

{
  "provider": "openai",
  "prompt": "Was ist künstliche Intelligenz?",
  "systemMessage": "Du bist ein hilfreicher Assistent",
  "maxTokens": 1000,
  "temperature": 0.7,
  "appId": "my-app"
}
```

### Batch Requests
```
POST /oracle/batch
Content-Type: application/json

[
  {
    "provider": "openai",
    "prompt": "Erste Frage"
  },
  {
    "provider": "anthropic",
    "prompt": "Zweite Frage"
  }
]
```

## API Documentation

Nach dem Start ist die Swagger-Dokumentation verfügbar unter:
```
http://localhost:3000/api
```

## Beispiel-Integration

### JavaScript/TypeScript Client:
```javascript
const response = await fetch('http://localhost:3000/oracle/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    provider: 'openai',
    prompt: 'Erkläre mir Machine Learning',
    appId: 'my-frontend-app'
  })
});

const data = await response.json();
console.log(data.response);
```

### Python Client:
```python
import requests

response = requests.post('http://localhost:3000/oracle/ask', json={
    'provider': 'anthropic',
    'prompt': 'Was ist Deep Learning?',
    'appId': 'my-python-app'
})

data = response.json()
print(data['response'])
```

## Provider Konfiguration

### OpenAI
- Model: GPT-4
- Benötigt: `OPENAI_API_KEY`

### Anthropic (Claude)
- Model: Claude-3-Sonnet
- Benötigt: `ANTHROPIC_API_KEY`

### Google AI
- Model: Gemini Pro
- Benötigt: `GOOGLE_AI_API_KEY`

## Struktur

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── oracle/
│   ├── oracle.module.ts    # Oracle module
│   ├── oracle.controller.ts # REST endpoints
│   ├── dto/                # Data transfer objects
│   │   ├── ai-request.dto.ts
│   │   └── ai-response.dto.ts
│   └── services/
│       └── ai-provider.service.ts # AI provider logic
└── common/
    ├── exceptions/         # Custom exceptions
    └── filters/           # Global error handling
```

## Erweiterungen

Das System kann einfach erweitert werden:
- Neue AI Provider hinzufügen
- Rate Limiting implementieren
- Authentifizierung hinzufügen
- Request/Response Caching
- Metriken und Monitoring