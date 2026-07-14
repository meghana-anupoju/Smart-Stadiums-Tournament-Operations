import React, { memo } from 'react';
import './QuickActions.css';

export interface QuickActionsProps {
  onActionSelect: (prompt: string) => void;
  disabled: boolean;
}

const ACTIONS = [
  { label: '🏟️ Find My Seat', prompt: 'I need help navigating to my seat in the stadium.' },
  { label: '🚶 Crowd Status', prompt: 'Which stadium gates currently have the shortest wait times?' },
  { label: '🌍 Translate', prompt: 'Can you help me translate a phrase into Spanish for the local staff?' },
  { label: '♻️ Sustainability', prompt: 'Where can I find the recycling stations and sustainable transport options?' },
];

/**
 * Renders quick action buttons to directly address challenge problem statements.
 */
const QuickActions: React.FC<QuickActionsProps> = memo(({ onActionSelect, disabled }) => {
  return (
    <div className="quick-actions" aria-label="Quick action prompts">
      {ACTIONS.map((action, idx) => (
        <button
          key={idx}
          className="quick-action-btn"
          onClick={() => onActionSelect(action.prompt)}
          disabled={disabled}
          aria-label={action.label}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
