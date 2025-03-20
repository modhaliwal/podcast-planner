
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { StatsCard, RecentGuests, UpcomingEpisodes } from '@/components/dashboard/DashboardCards';
import { Calendar, CheckCircle, MicIcon, Users } from 'lucide-react';

const Dashboard = () => {
  const { guests, episodes, isDataLoading } = useAuth();
  
  // Calculate statistics
  const totalGuests = guests.length;
  const totalEpisodes = episodes.length;
  const publishedEpisodes = episodes.filter(ep => ep.status === 'published').length;
  const scheduledEpisodes = episodes.filter(ep => ep.status === 'scheduled').length;
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="section-subtitle">Manage your podcast guests and episodes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Guests"
            value={totalGuests}
            description="People in your database"
            icon={<Users className="h-5 w-5" />}
          />
          
          <StatsCard
            title="Total Episodes"
            value={totalEpisodes}
            description="Episodes created"
            icon={<MicIcon className="h-5 w-5" />}
          />
          
          <StatsCard
            title="Published"
            value={publishedEpisodes}
            description="Episodes published"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          
          <StatsCard
            title="Upcoming"
            value={scheduledEpisodes}
            description="Episodes scheduled"
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentGuests guests={guests} />
          <UpcomingEpisodes episodes={episodes} guests={guests} />
        </div>
      </div>
    </Shell>
  );
};

export default Dashboard;
