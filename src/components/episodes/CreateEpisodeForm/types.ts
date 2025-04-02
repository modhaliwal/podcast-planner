
export interface EpisodeFormData {
  episodeNumber: number;
  scheduled: Date;
  title?: string;
  topic?: string;
  introduction?: string;
  guestIds?: string[];
}
