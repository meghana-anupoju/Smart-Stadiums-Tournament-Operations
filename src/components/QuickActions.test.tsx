import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuickActions from './QuickActions';

describe('QuickActions Component', () => {
  it('renders all quick action buttons', () => {
    const mockOnSelect = vi.fn();
    render(<QuickActions onActionSelect={mockOnSelect} disabled={false} />);
    
    expect(screen.getByText('🏟️ Find My Seat')).toBeInTheDocument();
    expect(screen.getByText('🚶 Crowd Status')).toBeInTheDocument();
    expect(screen.getByText('🌍 Translate')).toBeInTheDocument();
    expect(screen.getByText('♻️ Sustainability')).toBeInTheDocument();
  });

  it('calls onActionSelect with correct prompt when a button is clicked', () => {
    const mockOnSelect = vi.fn();
    render(<QuickActions onActionSelect={mockOnSelect} disabled={false} />);
    
    const navButton = screen.getByText('🏟️ Find My Seat');
    fireEvent.click(navButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith('I need help navigating to my seat in the stadium.');
  });

  it('disables buttons when disabled prop is true', () => {
    const mockOnSelect = vi.fn();
    render(<QuickActions onActionSelect={mockOnSelect} disabled={true} />);
    
    const navButton = screen.getByText('🏟️ Find My Seat');
    expect(navButton).toBeDisabled();
  });
});
