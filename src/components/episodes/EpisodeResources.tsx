
import { Link, FileText } from 'lucide-react';
import { Episode } from '@/lib/types';

interface EpisodeResourcesProps {
  episode: Episode;
}

export function EpisodeResources({ episode }: EpisodeResourcesProps) {
  // Ensure resources is always an array we can safely map over
  const resourcesArray = Array.isArray(episode.resources) 
    ? episode.resources 
    : [];
  
  // If no resources, return null
  if (resourcesArray.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Additional Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resourcesArray.map((resource, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-md hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="font-medium text-base">{resource.label}</h3>
                {resource.description && (
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                )}
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                >
                  <Link className="h-3.5 w-3.5 mr-1.5" />
                  <span>View Resource</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
