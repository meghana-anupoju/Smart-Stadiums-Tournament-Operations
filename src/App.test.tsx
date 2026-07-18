import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the Gemini service to avoid actual API calls during tests
vi.mock('./geminiService', () => ({
  initializeGemini: vi.fn().mockReturnValue(true),
  generateChatResponse: vi.fn().mockResolvedValue('This is a mocked GenAI response.')
}));

describe('Smart Assistant App', () => {
  it('renders the initial welcome message', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to the FIFA World Cup 2026!/i)).toBeInTheDocument();
  });

  it('allows user to send a message in the chat interface', async () => {
    render(<App />);
    
    const chatInput = screen.getByPlaceholderText(/Ask about stadium, food, translation.../i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(chatInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(await screen.findByText('Test message')).toBeInTheDocument();
    
    // Check if mock response comes back
    expect(await screen.findByText('This is a mocked GenAI response.')).toBeInTheDocument();
  });

  it('allows user to send a message using Enter key', async () => {
    render(<App />);
    
    const chatInput = screen.getByPlaceholderText(/Ask about stadium, food, translation.../i);

    fireEvent.change(chatInput, { target: { value: 'Another test message' } });
    fireEvent.keyDown(chatInput, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(await screen.findByText('Another test message')).toBeInTheDocument();
  });

  it('does not send message on shift+enter', () => {
    render(<App />);
    
    const chatInput = screen.getByPlaceholderText(/Ask about stadium, food, translation.../i);

    fireEvent.change(chatInput, { target: { value: 'Multiline\nmessage' } });
    fireEvent.keyDown(chatInput, { key: 'Enter', code: 'Enter', shiftKey: true });

    // Assuming it doesn't send, the message won't appear as a user message immediately
    expect(screen.queryByText('Multiline\nmessage')).not.toBeInTheDocument();
  });
});
