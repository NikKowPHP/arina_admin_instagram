import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TriggerList from './trigger-list';
import { Trigger } from '@/types/database';

const mockTriggers: Trigger[] = [
  {
    id: '1',
    name: 'Test Trigger 1',
    keyword: 'test1',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Trigger 2',
    keyword: 'test2',
    status: 'inactive',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const mockOnEdit = jest.fn((trigger: Trigger) => {
  // Mock implementation
  return trigger;
});

const mockOnDelete = jest.fn((id: string) => {
  // Mock implementation
  return id;
});

describe('TriggerList Component', () => {
  it('renders the list of triggers', () => {
    render(<TriggerList triggers={mockTriggers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Trigger 1')).toBeInTheDocument();
    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.getByText('Test Trigger 2')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TriggerList triggers={mockTriggers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTriggers[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TriggerList triggers={mockTriggers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});