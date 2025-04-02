
# System Architecture

The Podcast Planner system employs a modern web application architecture:

## Frontend
- **React**: Core UI framework with functional components and hooks
- **React Router**: URL-based navigation for application routing
- **React Hook Form**: Form management and validation
- **Tailwind CSS**: Utility-first styling framework
- **Shadcn UI**: Component library for consistent UI elements
- **TanStack React Query**: Data fetching, caching, and state management

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

## Content Versioning
- Content versioning system for tracking changes in AI-generated content
- Storage of version history with attribution to generation source
- Version comparison and selection capabilities

## System Components Interaction Flow
1. Users authenticate via Supabase Auth
2. React Query manages data fetching, caching, and state synchronization
3. Client application interacts with Supabase database for CRUD operations
4. Edge Functions process specialized tasks like AI content generation
5. AI-generated content is stored in the database with version history
6. User interface presents data in organized, task-specific views

## Repository Pattern Implementation
The application uses a repository pattern to abstract data access:

1. **Domain Models**: Type definitions representing business entities (Episode, Guest)
2. **Data Transfer Objects (DTOs)**: Types for creating and updating entities
3. **Data Mappers**: Classes responsible for transforming between domain and database models
4. **Repository Classes**:
   - Abstract CRUD operations through a consistent interface
   - Handle specific entity validation and relationships
   - Manage database operations with proper error handling
5. **Hooks Integration**:
   - Custom hooks expose repositories to React components
   - Provide seamless integration with React Query

This layered architecture provides:
- Clear separation of concerns
- Type safety throughout the application
- Consistent error handling
- Improved testability
- Centralized data access logic

## File Organization
- Component-based architecture with focused, single-responsibility components
- Custom hooks for reusable logic and state management
- Repository layer for database interaction
- Type definitions for ensuring data consistency
