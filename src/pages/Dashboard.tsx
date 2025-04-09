
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { StatsCard, RecentGuests, UpcomingEpisodes } from '@/components/dashboard/DashboardCards';
import { Calendar, CheckCircle, MicIcon, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';

const Dashboard = () => {
  const { 
    guests, 
    episodes, 
    refreshAllData, 
    user 
  } = useAuth();
  const hasInitializedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Debug guests data
  console.log("Dashboard rendering with guests:", guests?.length, "episodes:", episodes?.length);
  
  // Load data when the component mounts and user is available
  useEffect(() => {
    if (!hasInitializedRef.current && user?.id) {
      console.log("Dashboard component mounted with user, refreshing data");
      
      const loadData = async () => {
        await refreshAllData();
        hasInitializedRef.current = true;
        setIsLoaded(true);
      };
      
      loadData();
    } else if (guests?.length > 0 && !isLoaded) {
      // If we already have guests data but haven't marked as loaded
      setIsLoaded(true);
    }
  }, [refreshAllData, user, guests, isLoaded]);
  
  // Calculate statistics
  const totalGuests = guests?.length || 0;
  const totalEpisodes = episodes?.length || 0;
  const publishedEpisodes = episodes?.filter(ep => ep.status === 'published')?.length || 0;
  const scheduledEpisodes = episodes?.filter(ep => ep.status === 'scheduled')?.length || 0;
  
  return (
    <Shell>
      <PageLayout 
        title="Dashboard" 
        subtitle="Manage your podcast guests and episodes"
      >
        {!isLoaded ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <ResponsiveGrid 
              cols={{ default: 1, sm: 2, lg: 4 }}
              gap="gap-3 sm:gap-4"
            >
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
            </ResponsiveGrid>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <RecentGuests guests={guests || []} />
              <UpcomingEpisodes episodes={episodes || []} guests={guests || []} />
            </div>
          </>
        )}
      </PageLayout>
    </Shell>
  );
};

export default Dashboard;
