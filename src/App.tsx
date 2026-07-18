import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Menu, Globe2 } from 'lucide-react';
import './App.css';
import { generateChatResponse, initializeGemini } from './geminiService';
import MessageBubble from './components/MessageBubble';
import QuickActions from './components/QuickActions';

export interface Message {
  role: 'user' | 'model';
  content: string;
}

/**
 * Main application component for the WC26 Assistant.
 * Manages chat state, UI orchestration, and interaction with the Gemini API.
 */
function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Welcome to the FIFA World Cup 2026! I am your Smart Assistant. I can help you find your seat, translate languages, and answer stadium questions. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Automatically scrolls the chat window to the newest message.
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /**
   * Handles sending a message (either typed or from quick actions).
   * @param {string} textToSend - The text content to send to the AI.
   */
  const handleSend = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsLoading(true);

    const history = messages.slice(1).map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const responseText = await generateChatResponse(textToSend, history);
    
    setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    setIsLoading(false);
  }, [isLoading, messages]);

  const onSendClick = useCallback(() => {
    handleSend(input);
    setInput('');
  }, [input, handleSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendClick();
    }
  }, [onSendClick]);

  const [dynamicKey, setDynamicKey] = useState<string>('');
  const [dynamicModel, setDynamicModel] = useState<string>('gemini-1.5-flash');
  const [dynamicBaseUrl, setDynamicBaseUrl] = useState<string>('');
  const [needsKey, setNeedsKey] = useState<boolean>(false);

  useEffect(() => {
    // Check if key is available on mount
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) {
      setNeedsKey(true);
    }
  }, []);

  const handleSetKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (dynamicKey.trim()) {
      const success = initializeGemini(
        dynamicKey.trim(),
        dynamicModel.trim() || undefined,
        dynamicBaseUrl.trim() || undefined
      );
      if (success) {
        setNeedsKey(false);
      } else {
        alert('Failed to initialize with this key. Please check the console.');
      }
    }
  };

  if (needsKey) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center', maxWidth: '400px' }}>
          <Globe2 size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Setup Required</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            The Vercel environment variable (VITE_GEMINI_API_KEY) was not found. Please provide your Gemini API key below to continue.
          </p>
          <form onSubmit={handleSetKey}>
            <input 
              type="password" 
              placeholder="Enter Gemini API Key..." 
              value={dynamicKey}
              onChange={(e) => setDynamicKey(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-main)', color: 'white', marginBottom: '1rem' }}
              required
            />
            <input 
              type="text" 
              placeholder="Model Name (default: gemini-1.5-flash)" 
              value={dynamicModel}
              onChange={(e) => setDynamicModel(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-main)', color: 'white', marginBottom: '1rem' }}
            />
            <input 
              type="text" 
              placeholder="Base URL (optional, for custom endpoints)" 
              value={dynamicBaseUrl}
              onChange={(e) => setDynamicBaseUrl(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-main)', color: 'white', marginBottom: '1rem' }}
            />
            <button type="submit" className="send-button" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', justifyContent: 'center' }}>
              Save Key & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1><Globe2 size={24} color="var(--primary)" /> WC26 Assistant</h1>
        <button aria-label="Menu" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
          <Menu size={24} />
        </button>
      </header>

      <div className="chat-container">
        {messages.map((msg, idx) => (
          <MessageBubble 
            key={idx} 
            role={msg.role} 
            content={msg.content} 
            isLatestModelMessage={msg.role === 'model' && idx === messages.length - 1} 
          />
        ))}
        {isLoading && (
          <div className="typing-indicator" aria-label="Assistant is typing...">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <QuickActions 
        onActionSelect={handleSend} 
        disabled={isLoading} 
      />

      <div className="input-container">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about stadium, food, translation..."
          rows={1}
          aria-label="Type your message here"
        />
        <button 
          className="send-button"
          onClick={onSendClick}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
