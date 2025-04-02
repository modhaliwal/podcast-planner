
# Content Management Conventions

This document outlines the conventions and best practices for managing content within the Podcast Planner application.

## AI-Generated Content

### Content Generation

The application supports AI-generated content for:
- Guest biographies
- Guest background research
- Episode notes
- Episode introductions

When generating content, consider the following:

1. **Provide Context**: The more specific information you provide, the better the AI can generate relevant content
2. **Review Generated Content**: Always review AI-generated content for accuracy and appropriateness
3. **Edit as Needed**: Use AI-generated content as a starting point and edit to match your voice and style

### Content Versioning

Content versioning allows you to:
- Keep track of different versions of generated content
- Compare versions side by side
- Select the most suitable version for your needs
- Maintain a history of content iterations

Each version includes:
- Content body
- Generation timestamp
- Source (AI provider used)
- Version number
- Active status (which version is currently selected)

## Image Management

### Guest Profile Images

For guest profile images:
- Use square or 1:1 aspect ratio images for best display
- Recommended resolution: 500x500 pixels
- Supported formats: JPG, PNG
- Maximum file size: 2MB

### Episode Cover Art

For episode cover art:
- Use square or 1:1 aspect ratio images for podcast platforms
- Recommended resolution: 1400x1400 pixels (minimum 1400x1400 per podcast platform requirements)
- Supported formats: JPG, PNG
- Maximum file size: 5MB

## Text Formatting

The application supports basic Markdown formatting in text fields:

- **Bold**: `**text**`
- *Italic*: `*text*`
- Headers: `# Header 1`, `## Header 2`, etc.
- Lists:
  ```
  * Item 1
  * Item 2
  ```
- Links: `[link text](URL)`

## Resource Management

When adding resources to episodes:
- Provide a descriptive label
- Include the full URL
- Add a brief description of the resource
- Group related resources together

## Status Management

### Guest Statuses

- **Potential**: Initial guest identification
- **Contacted**: Outreach has been made
- **Confirmed**: Guest has agreed to appear
- **Appeared**: Guest has recorded an episode

### Episode Statuses

- **Scheduled**: Episode is planned with date
- **Recorded**: Episode has been recorded but not published
- **Published**: Episode is live on podcast platforms
