
# Version Management System Documentation

This document explains the version management system used throughout the application to track and manage different versions of text content.

## Overview

The version management system allows users to:
- Create and maintain multiple versions of content
- Switch between versions
- Track when versions were created and by what source (manual, AI, import)
- Clear all versions and start fresh

## Core Components

### 1. ContentVersion Type

The foundation of the version system is the `ContentVersion` type defined in `@/lib/types`:

```typescript
interface ContentVersion {
  id: string;           // Unique identifier for the version
  content: string;      // The actual content
  timestamp: string;    // ISO date string when version was created
  source: "manual" | "ai" | "import"; // Source of the version
  active?: boolean;     // Whether this is the active version
}
```

### 2. Version Management Hooks

The system is built around a set of modular hooks in `src/hooks/versions/`:

#### 2.1 `useVersionState`

Manages the state of versions, including:
- Tracking the active version ID
- Storing the collection of versions
- Initializing versions when none exist

```typescript
const { 
  activeVersionId,      // ID of the currently active version
  versions,             // Array of all versions
  setVersions,          // Function to update versions
  setActiveVersionId,   // Function to set the active version
} = useVersionState({ form, fieldName, versionsFieldName });
```

#### 2.2 `useVersionActions`

Provides actions for interacting with versions:
- `handleContentChange`: Creates a new version when content changes
- `selectVersion`: Switches to a specific version
- `clearAllVersions`: Removes all versions except the current content
- `addNewVersion`: Adds a new version with specified content

```typescript
const {
  handleContentChange,
  selectVersion,
  clearAllVersions,
  addNewVersion
} = useVersionActions({
  form,
  fieldName,
  versionsFieldName,
  activeVersionId,
  versions,
  setVersions,
  setActiveVersionId
});
```

#### 2.3 `useSelectorProps`

Creates props for the VersionSelector component:
```typescript
const { versionSelectorProps } = useSelectorProps({
  versions,
  activeVersionId,
  selectVersion,
  clearAllVersions
});
```

#### 2.4 `useContentVersions` (Main Hook)

Combines all the above hooks into one convenient API:
```typescript
const {
  activeVersionId,
  versions,
  handleContentChange,
  selectVersion,
  clearAllVersions,
  addNewVersion,
  versionSelectorProps
} = useContentVersions({
  form,
  fieldName,
  versionsFieldName
});
```

### 3. Context Providers

#### 3.1 `NotesVersionsContext`

Provides version management functionality to components via React Context:
```typescript
<NotesVersionsProvider form={form} fieldName="notes" versionsFieldName="notesVersions">
  <ChildComponents />
</NotesVersionsProvider>
```

Components can then access version management functionality:
```typescript
const { versionSelectorProps, addNewVersion } = useNotesVersions();
```

### 4. UI Components

#### 4.1 `VersionSelector`

A dropdown menu component that displays all versions and allows users to:
- Select a version
- See metadata about each version (timestamp, source)
- Clear all versions

```typescript
<VersionSelector
  versions={versions}
  onSelectVersion={selectVersion}
  activeVersionId={activeVersionId}
  onClearAllVersions={clearAllVersions}
/>
```

#### 4.2 `VersionManager` (for Background Research)

A specialized component that manages versions for the background research section:
```typescript
const {
  activeVersionId,
  handleEditorBlur,
  addAIVersion,
  versionSelectorProps
} = VersionManager({
  content,
  versions,
  onVersionsChange,
  onContentChange
});
```

## Integration Examples

### 1. Episode Notes

The `NotesField` component in `FormSections/ContentComponents/NotesField.tsx` uses the `NotesVersionsProvider` to manage versions of episode notes:

```typescript
<NotesVersionsProvider 
  form={form} 
  fieldName="notes" 
  versionsFieldName="notesVersions"
>
  <NotesFieldContent 
    editMode={editMode}
    label={label}
    placeholder={placeholder}
    guests={guests}
  />
</NotesVersionsProvider>
```

### 2. Guest Bio

The `BioSection` component in `guests/form-sections/bio/index.tsx` uses the `VersionManager` to handle versions of guest bios:

```typescript
const {
  activeVersionId,
  handleEditorBlur,
  addAIVersion,
  versionSelectorProps
} = VersionManager({
  content: bio,
  versions: bioVersions,
  onVersionsChange: onVersionsChange,
  onContentChange: (newContent) => {
    form.setValue('bio', newContent);
    setBio(newContent);
  }
});
```

### 3. Guest Background Research

The `BackgroundResearchSection` in `guests/form-sections/background-research/index.tsx` similarly uses the `VersionManager` for research content.

## Data Flow

1. Content is edited in a form field or editor
2. When the content changes and is saved (blur event, manual save, or AI generation)
3. `handleContentChange` or `addNewVersion` is called
4. A new version is created and added to the versions array
5. The form's versions field is updated
6. The UI reflects the new active version

## Using with AI-Generated Content

When content is generated via AI:

1. AI generates new content
2. `addNewVersion(content, "ai")` is called
3. A new version is created with source="ai"
4. The new version becomes the active version
5. The UI updates to show the new content

## Implementation Guidelines

When implementing version management in a new feature:

1. Use the `useContentVersions` hook for form-based components
2. For more specialized needs, use `VersionManager` or create a context provider
3. Always maintain both the content field and the versions field in your form
4. When saving data, make sure to persist both the content and versions

---

## Troubleshooting

### Common Issues

1. **Versions not saving**: Ensure the form's setValue is being called for the versionsFieldName
2. **Active version not updating**: Check that activeVersionId is being set correctly
3. **Version selector not showing**: Verify versions array is not empty and being passed properly

### Best Practices

1. Always initialize versions when loading content
2. Use proper typing with ContentVersion
3. Consider separating read-only views from editable views
4. For complex forms, use the context-based approach
