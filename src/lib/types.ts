
export interface SocialLinks {
  twitter?: string; // Keeping for backward compatibility, now represents X
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  youtube?: string;
  other?: { label: string; url: string }[];
}

export interface Guest {
  id: string;
  name: string;
  title: string;
  company?: string; // Added company/organization field
  email?: string;
  phone?: string;
  bio: string;
  imageUrl?: string;
  socialLinks: SocialLinks;
  notes?: string;
  backgroundResearch?: string;
  status?: 'potential' | 'contacted' | 'confirmed' | 'appeared';
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  notes: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  scheduled: string;       // Recording session date and time
  publishDate?: string;    // Date the episode will be published
  status: 'scheduled' | 'recorded' | 'published';
  coverArt?: string;       // URL to the cover art image
  guestIds: string[];
  introduction: string;
  topics: Topic[];
  notes: string;
  recordingLinks?: {
    audio?: string;
    video?: string;
    transcript?: string;
    other?: { label: string; url: string }[];
  };
  createdAt: string;
  updatedAt: string;
}
