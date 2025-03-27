import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GuestCard } from '@/components/guests/GuestListCard';
import { EpisodeCard } from '@/components/episodes/EpisodeCard';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            trend.positive ? "text-green-600" : "text-red-600"
          )}>
            {trend.positive ? "↑" : "↓"} {trend.value} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentGuestsProps {
  guests: Guest[];
  className?: string;
}

export function RecentGuests({ guests, className }: RecentGuestsProps) {
  // Sort guests by createdAt date and get the 5 most recent
  const recentGuests = [...guests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Guests</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/guests">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <CardDescription>The latest guests added to your database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentGuests.map(guest => (
            <GuestCard key={guest.id} guest={guest} episodes={[]} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/guests">
            <Users className="mr-2 h-4 w-4" />
            Manage Guests
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface UpcomingEpisodesProps {
  episodes: Episode[];
  guests: Guest[];
  className?: string;
}

export function UpcomingEpisodes({ episodes, guests, className }: UpcomingEpisodesProps) {
  // Get scheduled episodes, sort by date, and take the next 3
  const upcomingEpisodes = episodes
    .filter(ep => ep.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime())
    .slice(0, 3);
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Episodes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/episodes">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <CardDescription>Your next scheduled recordings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEpisodes.map(episode => (
            <EpisodeCard 
              key={episode.id} 
              episode={episode} 
              guests={guests}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/episodes">
            <Calendar className="mr-2 h-4 w-4" />
            Manage Episodes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
