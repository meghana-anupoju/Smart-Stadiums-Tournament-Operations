import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeGemini, generateChatResponse } from './geminiService';

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          startChat: () => ({
            sendMessage: async () => ({
              response: { text: () => 'Mocked response' }
            })
          })
        };
      }
    }
  };
});

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'fake-key');
  });

  it('initializes successfully with a key', () => {
    const success = initializeGemini();
    expect(success).toBe(true);
  });

  it('fails gracefully when key is missing', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const success = initializeGemini();
    expect(success).toBe(false);
  });

  it('generates a response', async () => {
    const response = await generateChatResponse('Hello', []);
    expect(response).toBe('Mocked response');
  });
});
