
import { FileAudio, FileText, Film, Headphones, Link2 } from 'lucide-react';
import { Episode } from '@/lib/types';

interface EpisodeRecordingLinksProps {
  episode: Episode;
}

export function EpisodeRecordingLinks({ episode }: EpisodeRecordingLinksProps) {
  if (!episode.recordingLinks || episode.status === 'scheduled') {
    return null;
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground mb-2">Recordings</h2>
      <div className="flex flex-wrap gap-2">
        {episode.recordingLinks.audio && (
          <a 
            href={episode.recordingLinks.audio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Headphones className="h-4 w-4 mr-2" />
            <span className="text-sm">Audio</span>
          </a>
        )}
        
        {episode.recordingLinks.video && (
          <a 
            href={episode.recordingLinks.video}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Film className="h-4 w-4 mr-2" />
            <span className="text-sm">Video</span>
          </a>
        )}
        
        {episode.recordingLinks.transcript && (
          <a 
            href={episode.recordingLinks.transcript}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="text-sm">Transcript</span>
          </a>
        )}
        
        {episode.recordingLinks.other && episode.recordingLinks.other.map((link, index) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Link2 className="h-4 w-4 mr-2" />
            <span className="text-sm">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
