
# Content Management Conventions

This document outlines the standard patterns and conventions used for viewing, editing, and saving content within the Podcast Planner application.

## Hooks-based Pattern

We use a consistent hooks-based pattern for form handling and data persistence throughout the application:

### 1. Data Fetching and State Management

- Each content type (Episodes, Guests) has a dedicated data hook:
  - `useEpisodeData` / `useGuestData`: Manages fetching, state, and saving operations
  - `useFetchEpisode` / `useFetchGuest`: Handles just the data retrieval

### 2. Form Management

- Forms use dedicated hooks that encapsulate form state and submission logic:
  - `useEpisodeForm` / `useGuestForm`: Handle form state and submission
  - These hooks abstract away the implementation details of form processing

### 3. Content Flow

The standard flow for content management is:

1. **View**: Content is displayed using data from fetch hooks
2. **Edit**: When editing, form hooks manage the form state and validation
3. **Save**: On submission, the form hooks process the data and pass it to the data hooks for persistence

### 4. Version Management

For content that supports versioning (like bios, research notes, etc.):

- We use the `useVersionManager` hook to track version history
- Each version has a unique ID, timestamp, and source attribution
- Active versions are tracked and can be switched between

## Component Structure

Components follow a hierarchical structure:

- Page components (`EditEpisode`, `EditGuest`) are container components
- Form components (`EpisodeForm`, `GuestForm`) handle form layout and structure
- Section components organize related form fields
- Field components are the individual input elements

## Saving Convention

When saving content:

1. Form data is collected and validated
2. Media (images, etc.) are processed if present
3. The parent component's save function is called with the updated data
4. Success/failure is communicated via toast notifications
5. Navigation occurs after successful saves

## Best Practices

- Use hooks to encapsulate related logic
- Keep components focused on a single responsibility
- Process form data before persistence
- Provide clear feedback during and after save operations
- Handle errors gracefully with appropriate user feedback
