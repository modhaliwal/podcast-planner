
import { z } from 'zod';

export const episodeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  episodeNumber: z.coerce.number().int().positive("Episode number must be positive"),
  introduction: z.string().min(1, "Introduction is required"),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "recorded", "published"]),
  scheduled: z.date(),
  publishDate: z.date().optional().nullable(),
  guestIds: z.array(z.string()).min(1, "Select at least one guest"),
  coverArt: z.string().optional(),
});

export type EpisodeFormValues = z.infer<typeof episodeFormSchema>;
