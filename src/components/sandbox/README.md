
# Sandbox Components

This directory contains experimental components that are used exclusively in the Sandbox page.

## Purpose

- Provide a safe space to develop and test new components
- Prevent experimental code from affecting the rest of the application
- Allow for rapid prototyping without concern for breaking existing features

## Guidelines

1. Components in this directory should be self-contained
2. They should not be imported or used outside the Sandbox page
3. When a component is ready for production, it should be refactored and moved to the appropriate directory

## Structure

- Each component should have its own subdirectory
- Include any necessary hooks, utilities, or types within the component's directory
- Use clear naming conventions to indicate the experimental nature of the component

## Workflow

1. Create your experimental component in this directory
2. Test and iterate within the Sandbox page
3. Once finalized, refactor and move to the appropriate location in the main codebase
4. Remove the experimental version from the sandbox

## Component Refactoring Exceptions

Some components in this directory are intentionally kept as single files despite their length, due to tightly coupled functionality. The following components should NOT be split into smaller components:

### AIGenerationDropdownButton

This component combines a button, dropdown menu, and hover card with shared state and coordinated interactions. Splitting it would break its encapsulated functionality and complicate maintenance. Specific reasons include:

- The dropdown state affects multiple parts of the component
- The clear confirmation state is tightly coupled with the dropdown menu
- The hover card configuration is directly related to the button's primary action
- The coordinated appearance of notifications and selected items relies on shared props

When making changes to these components, maintain the single-file architecture to preserve their functionality.
