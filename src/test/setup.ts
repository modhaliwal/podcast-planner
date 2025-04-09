
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { QueryClient } from '@tanstack/react-query';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockReturnValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    }),
  },
}));

// Create msw server for API mocking
export const server = setupServer();

// Helper to create a clean QueryClient for testing
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
} 

// Setup before tests run
beforeAll(() => {
  server.listen();
});

// Clean up after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
