import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeGemini, generateChatResponse, resetGemini } from './geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    resetGemini();
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

  it('fails to generate response when initialize fails', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const response = await generateChatResponse('Hello', []);
    expect(response).toContain('Error: Gemini API key is missing');
  });

  it('handles errors during generateChatResponse gracefully', async () => {
    // Instead of messing with the class constructor mock, we can just hit the catch in generateChatResponse
    // by mocking getGenerativeModel
    const originalGetModel = GoogleGenerativeAI.prototype.getGenerativeModel;
    GoogleGenerativeAI.prototype.getGenerativeModel = () => { throw new Error('Test Error') };
    const response = await generateChatResponse('Hello', []);
    expect(response).toContain('Sorry, I am having trouble connecting');
    GoogleGenerativeAI.prototype.getGenerativeModel = originalGetModel;
  });
});
