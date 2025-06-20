/// <reference types="cypress" />

describe('Trigger CRUD Workflow', () => {
  const username = 'testuser';
  const password = 'password';

  beforeEach(() => {
    // Visit the login page and log in
    cy.visit('/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('form').submit();
    cy.url().should('include', '/dashboard');
  });

  it('should create, edit, and delete a trigger', () => {
    // Navigate to the Triggers page
    cy.visit('/dashboard/triggers');

    // Create a new trigger
    const newTriggerName = 'Test Trigger ' + Math.random().toString(36).substring(7);
    const newTriggerKeyword = 'keyword' + Math.random().toString(36).substring(7);
    cy.get('button:contains("Create Trigger")').click();
    cy.get('input[name="name"]').type(newTriggerName);
    cy.get('input[name="keyword"]').type(newTriggerKeyword);
    cy.get('input[name="status"]').type('active');
    cy.get('form').submit();

    // Verify the trigger was created
    cy.contains(newTriggerName).should('exist');

    // Edit the trigger
    cy.contains(newTriggerName).parent().parent().within(() => {
      cy.get('button:contains("Edit")').click();
    });
    const updatedName = 'Updated Trigger ' + Math.random().toString(36).substring(7);
    cy.get('input[name="name"]').clear().type(updatedName);
    cy.get('form').submit();

    // Verify the trigger was updated
    cy.contains(updatedName).should('exist');

    // Delete the trigger
    cy.contains(updatedName).parent().parent().within(() => {
      cy.get('button:contains("Delete")').click();
    });
    cy.get('button:contains("Confirm")').click();

    // Verify the trigger was deleted
    cy.contains(updatedName).should('not.exist');
  });
});