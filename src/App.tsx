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
  const [baseUrlInput, setBaseUrlInput] = useState('');
  const [modelInput, setModelInput] = useState('');
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
      const success = initializeGemini(
        apiKeyInput.trim(), 
        baseUrlInput.trim() || undefined, 
        modelInput.trim() || undefined
      );
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', overflowY: 'auto' }}>
          <KeyRound size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Security Configuration</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            To securely use the GenAI Smart Assistant, enter your Gemini API Key below. <br/><br/>
            <strong>Note:</strong> If you were provided a special hackathon key, it might require a specific Model Name (like <code>gemini-pro</code>) or a custom Base URL proxy.
          </p>
          <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
            <input 
              type="password" 
              className="chat-input" 
              placeholder="API Key (Required)" 
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              required
            />
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Model (Optional, default: gemini-1.5-flash)" 
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
            />
            <input 
              type="url" 
              className="chat-input" 
              placeholder="Base URL Proxy (Optional)" 
              value={baseUrlInput}
              onChange={(e) => setBaseUrlInput(e.target.value)}
            />
            <button type="submit" className="send-button" style={{ width: '100%', borderRadius: '1.5rem', marginTop: '0.5rem' }}>
              Connect
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
