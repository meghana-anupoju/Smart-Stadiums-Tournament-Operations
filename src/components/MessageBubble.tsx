import React, { memo } from 'react';

export interface MessageProps {
  role: 'user' | 'model';
  content: string;
  isLatestModelMessage: boolean;
}

/**
 * Renders an individual chat message bubble.
 * Wrapped in React.memo for rendering efficiency.
 */
const MessageBubble: React.FC<MessageProps> = memo(({ role, content, isLatestModelMessage }) => {
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`message-wrapper ${role}`}>
      <div 
        className="message-bubble" 
        aria-live={isLatestModelMessage ? 'polite' : 'off'}
      >
        <p>{renderMessageContent(content)}</p>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
