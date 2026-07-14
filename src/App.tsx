import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Globe2, KeyRound } from 'lucide-react';
import './App.css';
import { generateChatResponse, initializeGemini } from './geminiService';

interface Message {
  role: 'user' | 'model';
  content: string;
}

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Welcome to the FIFA World Cup 2026! I am your Smart Assistant. I can help you find your seat, translate languages, and answer stadium questions. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      const success = initializeGemini(apiKeyInput.trim());
      if (success) {
        setIsConfigured(true);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const history = messages.slice(1).map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const responseText = await generateChatResponse(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!isConfigured) {
    return (
      <div className="app-container">
        <header className="header">
          <h1><Globe2 size={24} color="var(--primary)" /> WC26 Assistant</h1>
        </header>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <KeyRound size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Security Configuration</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
            To securely use the GenAI Smart Assistant without exposing secrets on GitHub Pages, please enter your Gemini API Key below. This key is only stored in your browser's memory for this session.
          </p>
          <form onSubmit={handleSetup} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input 
              type="password" 
              className="chat-input" 
              placeholder="Enter Gemini API Key" 
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              required
            />
            <button type="submit" className="send-button" style={{ width: 'auto', padding: '0 1rem', borderRadius: '1.5rem' }}>
              Start
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
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className="message-bubble" aria-live={msg.role === 'model' && idx === messages.length - 1 ? 'polite' : 'off'}>
              <p>{renderMessageContent(msg.content)}</p>
            </div>
          </div>
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
          onClick={handleSend}
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
