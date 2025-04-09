import { render, screen } from '@testing-library/react';
import { EpisodeCard } from './EpisodeCard';
import { EpisodeStatus } from '@/lib/enums';
import { vi } from 'vitest';

// Mock navigation
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="mock-link">
      {children}
    </a>
  ),
}));

describe('EpisodeCard', () => {
  const mockEpisode = {
    id: 'episode-1',
    title: 'Test Episode',
    episodeNumber: 42,
    status: EpisodeStatus.SCHEDULED,
    introduction: 'This is a test episode',
    topic: 'Testing',
    scheduled: '2023-05-15T10:00:00Z',
    guestIds: ['guest-1', 'guest-2'],
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z',
  };

  test('renders episode details correctly', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    
    // Check that critical information is displayed
    expect(screen.getByText('Test Episode')).toBeInTheDocument();
    expect(screen.getByText('#42')).toBeInTheDocument();
    expect(screen.getByText('SCHEDULED')).toBeInTheDocument();
    
    // Check that the link points to the correct URL
    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', `/episodes/${mockEpisode.id}`);
  });

  test('shows correct guest count', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('2 Guests')).toBeInTheDocument();
  });
}); 