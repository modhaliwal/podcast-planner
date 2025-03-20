
export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  youtube?: string;
  other?: { label: string; url: string }[];
}

export interface Guest {
  id: string;
  name: string;
  title: string;
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
