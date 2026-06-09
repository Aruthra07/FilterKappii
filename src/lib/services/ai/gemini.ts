import { IAIService } from './interface';
import { MockAIService } from './mock';

export class GeminiService implements IAIService {
  private apiKey: string;
  private mockFallback: MockAIService;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey || this.apiKey === 'mock-gemini-key') {
      throw new Error('GEMINI_API_KEY must be configured to use GeminiService');
    }
    this.mockFallback = new MockAIService();
  }

  async generateText(options: { systemPrompt?: string; prompt: string; temperature?: number }): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${options.systemPrompt || ''}\n\n${options.prompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: options.temperature ?? 0.2,
          }
        }),
      }
    );
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API responded with code: ${response.status} - ${errText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  // Delegate to mock embedding generator
  async generateEmbedding(text: string): Promise<number[]> {
    return this.mockFallback.generateEmbedding(text);
  }
}
