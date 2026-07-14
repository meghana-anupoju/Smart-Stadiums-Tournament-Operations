import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the Gemini service to avoid actual API calls during tests
vi.mock('./geminiService', () => ({
  initializeGemini: vi.fn().mockReturnValue(true),
  generateChatResponse: vi.fn().mockResolvedValue('This is a mocked GenAI response.')
}));

describe('Smart Assistant App', () => {
  it('renders the configuration screen initially', () => {
    render(<App />);
    expect(screen.getByText('Security Configuration')).toBeInTheDocument();
  });

  it('allows user to enter API key and proceed to chat', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter Gemini API Key/i) as HTMLInputElement;
    const startButton = screen.getByRole('button', { name: /Start/i });
    
    fireEvent.change(input, { target: { value: 'fake-api-key' } });
    fireEvent.click(startButton);

    expect(screen.getByText(/Welcome to the FIFA World Cup 2026!/i)).toBeInTheDocument();
  });

  it('allows user to send a message in the chat interface', async () => {
    render(<App />);
    
    // Bypass config
    const apiKeyInput = screen.getByPlaceholderText(/Enter Gemini API Key/i);
    fireEvent.change(apiKeyInput, { target: { value: 'fake-api-key' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    const chatInput = screen.getByPlaceholderText(/Ask about stadium, food, translation.../i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(chatInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(await screen.findByText('Test message')).toBeInTheDocument();
    
    // Check if mock response comes back
    expect(await screen.findByText('This is a mocked GenAI response.')).toBeInTheDocument();
  });
});
