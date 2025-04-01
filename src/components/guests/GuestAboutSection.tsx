
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Guest, ContentVersion } from "@/lib/types";
import { format } from "date-fns";
import { Clock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
  // Helper to get most recent version
  const getMostRecentVersion = (versions?: ContentVersion[]) => {
    if (!versions || versions.length === 0) return null;
    return versions.reduce((latest, current) => 
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );
  };

  const bioVersion = getMostRecentVersion(guest.bioVersions);
  const researchVersion = getMostRecentVersion(guest.backgroundResearchVersions);
  
  // Parse markdown for background research
  const parsedBackgroundResearch = useMarkdownParser(guest.backgroundResearch);

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Guest Background</h4>
            {bioVersion && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(bioVersion.timestamp), "MMM d, yyyy")}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p>Last updated: {format(new Date(bioVersion.timestamp), "PPpp")}</p>
                      <p>Source: {bioVersion.source}</p>
                      {guest.bioVersions && (
                        <p>Versions: {guest.bioVersions.length}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guest.bio}</p>
        </div>

        {guest.backgroundResearch && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {researchVersion && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(researchVersion.timestamp), "MMM d, yyyy")}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p>Last updated: {format(new Date(researchVersion.timestamp), "PPpp")}</p>
                        <p>Source: {researchVersion.source}</p>
                        {guest.backgroundResearchVersions && (
                          <p>Versions: {guest.backgroundResearchVersions.length}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div 
              className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert 
                prose-headings:font-semibold prose-headings:mt-5 prose-headings:mb-2
                prose-p:my-2 prose-p:leading-relaxed
                prose-ul:my-2 prose-ul:pl-5 prose-li:my-1
                prose-ol:my-2 prose-ol:pl-5
                prose-table:text-sm prose-table:w-full prose-th:p-2 prose-th:bg-muted prose-th:border 
                prose-td:p-2 prose-td:border prose-img:my-4 prose-img:rounded-md
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                break-words"
              dangerouslySetInnerHTML={{ __html: parsedBackgroundResearch }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
