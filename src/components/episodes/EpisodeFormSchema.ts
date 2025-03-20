
import { z } from 'zod';
import { EpisodeStatus } from '@/lib/enums';

export const episodeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  episodeNumber: z.coerce.number().int().positive("Episode number must be positive"),
  introduction: z.string().min(1, "Introduction is required"),
  notes: z.string().optional(),
  status: z.nativeEnum(EpisodeStatus),
  scheduled: z.date(),
  publishDate: z.date().optional().nullable(),
  guestIds: z.array(z.string()).optional().default([]),
  coverArt: z.string().optional(),
  recordingLinks: z.object({
    audio: z.string().optional(),
    video: z.string().optional(),
    transcript: z.string().optional(),
    other: z.array(
      z.object({
        label: z.string(),
        url: z.string()
      })
    ).optional()
  }).optional().default({})
});

export type EpisodeFormValues = z.infer<typeof episodeFormSchema>;
