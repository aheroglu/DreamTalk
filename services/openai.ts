import { ENV } from '../config/env';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = ENV.OPENAI_API_KEY;

export interface DreamInterpretation {
  interpretation: string;
  summary: string;
  symbols: Array<{
    symbol: string;
    meaning: string;
    significance: string;
  }>;
  mood: {
    primary: string;
    secondary: string[];
    emotional_tone: string;
  };
  themes: string[];
  suggestions: string[];
}

export interface DreamAnalysisRequest {
  dreamText: string;
  userId?: string;
  context?: string;
}

// Dream interpretation prompt template
const DREAM_INTERPRETATION_PROMPT = `You are a professional dream analyst and psychologist. Analyze the following dream and provide a comprehensive interpretation in Turkish.

Dream Description: {dreamText}

Please provide your analysis as a JSON object with the following structure:
{
  "interpretation": "Detailed interpretation of the dream (2-3 paragraphs in Turkish)",
  "summary": "Brief summary in 1-2 sentences (in Turkish)", 
  "symbols": [
    {
      "symbol": "Symbol name",
      "meaning": "What this symbol represents",
      "significance": "Its significance in the dream context"
    }
  ],
  "mood": {
    "primary": "Main emotional tone",
    "secondary": ["Additional emotions"],
    "emotional_tone": "Overall emotional assessment"
  },
  "themes": ["Main themes identified in the dream"],
  "suggestions": ["Practical suggestions or insights"]
}

Guidelines:
- Be empathetic and supportive in your analysis
- Draw from established dream psychology (Jung, Freud, modern dream research)
- Focus on personal growth and self-understanding
- Avoid making definitive predictions about the future
- Keep interpretations positive and constructive
- Use Turkish language for all text responses
- Be culturally sensitive and respectful`;

export class OpenAIService {
  static async interpretDream(request: DreamAnalysisRequest): Promise<DreamInterpretation> {
    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      if (!request.dreamText || request.dreamText.trim().length === 0) {
        throw new Error('Dream text is required');
      }

      // Prepare the prompt
      const prompt = DREAM_INTERPRETATION_PROMPT.replace('{dreamText}', request.dreamText);

      // Call OpenAI API using fetch
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional dream analyst. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response received from OpenAI');
      }

      // Parse JSON response
      const interpretation: DreamInterpretation = JSON.parse(content);

      // Validate required fields
      if (!interpretation.interpretation || !interpretation.summary) {
        throw new Error('Invalid response format from OpenAI');
      }

      return interpretation;

    } catch (error) {
      console.error('Dream interpretation error:', error);
      
      // Provide fallback response in case of API failure
      if (error instanceof Error) {
        throw new Error(`Dream interpretation failed: ${error.message}`);
      }
      
      throw new Error('Unknown error occurred during dream interpretation');
    }
  }

  // Helper method to validate API key
  static validateConfiguration(): boolean {
    return Boolean(OPENAI_API_KEY);
  }

  // Method to estimate token usage (for cost monitoring)
  static estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English/Turkish
    return Math.ceil(text.length / 4);
  }
}

export default OpenAIService;