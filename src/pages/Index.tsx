
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MicIcon, UsersIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is logged in, redirect to dashboard
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Podcast Management <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 md:mb-12">
            All-in-one platform to organize your podcast guests, episodes, and recording schedule.
          </p>
          
          <Button size="lg" onClick={handleGetStarted} className="group">
            {user ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Guest Management</h3>
            <p className="text-muted-foreground">
              Keep all your podcast guests organized with detailed profiles, contact information, and notes.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <MicIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Episode Planning</h3>
            <p className="text-muted-foreground">
              Plan and manage your podcast episodes from initial concept to final publication.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Schedule Tracking</h3>
            <p className="text-muted-foreground">
              Never miss a recording with integrated scheduling and status tracking.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 mb-16">
        <div className="bg-primary/5 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to streamline your podcast workflow?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join other podcasters who are using our platform to organize their shows and focus on creating great content.
          </p>
          <Button onClick={handleGetStarted} variant="default" size="lg">
            {user ? 'Go to Dashboard' : 'Start Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
