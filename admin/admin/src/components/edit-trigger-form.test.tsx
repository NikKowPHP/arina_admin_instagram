// ROO-AUDIT-TAG :: plan-015-missing-test-script.md :: Add tests for EditTriggerForm
import { render, screen } from '@testing-library/react';
import EditTriggerForm from './edit-trigger-form';

describe('EditTriggerForm', () => {
  test('renders form', () => {
    render(<EditTriggerForm />);
    const formElement = screen.getByRole('form');
    expect(formElement).toBeInTheDocument();
  });
});
// ROO-AUDIT-TAG :: plan-015-missing-test-script.md :: END