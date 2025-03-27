
import React from 'react';
import { Info, Variable } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

/**
 * A floating toolbar that displays page information and available variables
 */
export function FloatingToolbar() {
  const location = useLocation();
  const { pageInfo, variables } = usePageInfo(location.pathname);
  
  return (
    <div className="fixed left-4 bottom-4 z-50 flex gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Page Information">
            <Info className="h-5 w-5" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Page Information</h4>
            <div className="text-sm text-muted-foreground space-y-1.5">
              <p><span className="font-medium">Path:</span> {location.pathname}</p>
              <p><span className="font-medium">Layout:</span> {pageInfo.layout}</p>
              <p><span className="font-medium">Components:</span></p>
              <ul className="list-disc pl-5">
                {pageInfo.components.map((component, i) => (
                  <li key={i}>{component}</li>
                ))}
              </ul>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Available Variables">
            <Variable className="h-5 w-5" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Available Variables</h4>
            {variables.length > 0 ? (
              <div className="text-sm space-y-1.5">
                <ul className="list-disc pl-5">
                  {variables.map((variable, i) => (
                    <li key={i} className="text-sm">
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{variable.name}</code>
                      <span className="text-muted-foreground"> - {variable.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No variables available on this page.</p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

// Type definitions for page information
interface PageInfo {
  layout: string;
  components: string[];
}

interface Variable {
  name: string;
  description: string;
}

interface PageInfoData {
  pageInfo: PageInfo;
  variables: Variable[];
}

/**
 * Custom hook to get information about the current page based on the path
 */
function usePageInfo(path: string): PageInfoData {
  // Map paths to their respective information
  const pageData: Record<string, PageInfoData> = {
    // Default/fallback page info
    default: {
      pageInfo: {
        layout: "Shell",
        components: ["PageLayout", "Content components"],
      },
      variables: [],
    },
    
    // Episode edit page
    "/episodes/[id]/edit": {
      pageInfo: {
        layout: "Shell",
        components: ["PageLayout", "EpisodeForm", "LoadingIndicator"],
      },
      variables: [
        { name: "episode.title", description: "The title of the episode" },
        { name: "episode.status", description: "Current publication status" },
        { name: "episode.description", description: "Episode description" },
        { name: "episode.recordingDate", description: "When the episode was recorded" },
        { name: "episode.releaseDate", description: "When the episode will be released" },
      ],
    },
    
    // Episodes list page
    "/episodes": {
      pageInfo: {
        layout: "Shell",
        components: ["PageLayout", "EpisodesList", "EpisodesHeader", "EpisodesSearchFilter"],
      },
      variables: [
        { name: "episode.title", description: "The title of each episode" },
        { name: "episode.status", description: "Publication status of each episode" },
      ],
    },
    
    // Guest pages
    "/guests": {
      pageInfo: {
        layout: "Shell",
        components: ["PageLayout", "GuestList", "GuestHeader", "GuestSearch"],
      },
      variables: [
        { name: "guest.name", description: "The full name of each guest" },
        { name: "guest.email", description: "The contact email of each guest" },
      ],
    },
    
    "/guests/[id]": {
      pageInfo: {
        layout: "Shell",
        components: ["PageLayout", "GuestDetail", "GuestViewHeader", "DeleteGuestDialog"],
      },
      variables: [
        { name: "guest.name", description: "The guest's full name" },
        { name: "guest.biography", description: "Guest biographical information" },
        { name: "guest.social", description: "Guest's social media links" },
      ],
    },
    
    "/guests/[id]/edit": {
      pageInfo: {
        layout: "Shell",
        components: ["PageLayout", "GuestForm", "BasicInfoSection", "SocialLinksSection"],
      },
      variables: [
        { name: "guest.name", description: "The guest's full name" },
        { name: "guest.email", description: "The guest's contact email" },
        { name: "guest.biography", description: "Guest biographical information" },
      ],
    },
  };
  
  // Match dynamic paths like '/episodes/123/edit' to '/episodes/[id]/edit'
  const dynamicPathMap: Record<string, string> = {
    "/episodes/": "/episodes/[id]",
    "/episodes/.*/edit": "/episodes/[id]/edit",
    "/guests/": "/guests/[id]",
    "/guests/.*/edit": "/guests/[id]/edit",
  };
  
  // Try to find the path in our map
  let bestMatch = 'default';
  
  // First check exact match
  if (pageData[path]) {
    bestMatch = path;
  } else {
    // Check for dynamic path matches
    for (const [pattern, mappedPath] of Object.entries(dynamicPathMap)) {
      const regex = new RegExp(`^${pattern}`);
      if (regex.test(path)) {
        bestMatch = mappedPath;
        break;
      }
    }
  }
  
  return pageData[bestMatch] || pageData.default;
}
