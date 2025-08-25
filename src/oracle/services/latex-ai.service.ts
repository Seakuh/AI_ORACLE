import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

export interface AIRequestDto {
  prompt: string;
  systemMessage?: string;
  maxTokens?: number;
  temperature?: number;
}

@Injectable()
export class LatexAIService {
  constructor(private readonly configService: ConfigService) {}

  private async callOpenAI(requestDto: AIRequestDto): Promise<any> {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const messages = [];
    if (requestDto.systemMessage) {
      messages.push({ role: "system", content: requestDto.systemMessage });
    }
    messages.push({ role: "user", content: requestDto.prompt });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages,
        max_tokens: requestDto.maxTokens || 2000,
        temperature: requestDto.temperature || 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokensUsed: response.data.usage.total_tokens,
    };
  }

  /**
   * Baut aus den übergebenen Daten ein professionelles LaTeX-Bewerbungsdokument
   */
  async generateLatexApplication(applicationData: any): Promise<string> {
    const systemMessage = `
Du bist ein perfekter Bewerbungshelfer, der aus JSON-Daten ein professionelles Bewerbungsanschreiben im LaTeX-Format erstellt.
Nutze eine moderne, saubere Struktur und achte auf korrekte deutsche Rechtschreibung.
`;

    const prompt = `
Hier sind die Bewerbungsdaten im JSON-Format:

${JSON.stringify(applicationData, null, 2)}

Erstelle daraus ein komplettes LaTeX-Dokument mit:
- Persönlichen Daten im Kopf
- Bewerbungstitel: "Bewerbung als ${
      applicationData.applicationData.position
    } bei ${applicationData.applicationData.company}"
- Anschreiben-Abschnitt mit Motivation
- Berufserfahrung, Fähigkeiten und Ausbildung als Listen
`;

    const result = await this.callOpenAI({
      prompt,
      systemMessage,
      maxTokens: 1500,
      temperature: 0.5,
    });

    return result.content;
  }
}
