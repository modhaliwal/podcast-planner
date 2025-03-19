
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
  title: string;
  scheduled: string;
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
