
# System Architecture

The Podcast Planner system employs a modern web application architecture:

## Frontend
- **React**: Core UI framework
- **React Router**: URL-based navigation
- **React Hook Form**: Form management
- **Tailwind CSS**: Styling
- **Shadcn UI**: Component library

## Backend
- **Supabase**: Backend-as-a-Service
  - Authentication: User management and authentication
  - Database: PostgreSQL database for data storage
  - Storage: File storage for guest images and episode cover art
  - Edge Functions: Serverless API endpoints for AI integration

## AI Integration
- **Multiple AI Provider Support**:
  - OpenAI: General content generation
  - Perplexity: Enhanced research and background information
  - Claude (Anthropic): Optional alternative provider

## System Components Interaction Flow
1. Users authenticate via Supabase Auth
2. Client application interacts with Supabase database for CRUD operations
3. Edge Functions process specialized tasks like AI content generation
4. AI-generated content is stored in the database with version history
5. User interface presents data in organized, task-specific views
