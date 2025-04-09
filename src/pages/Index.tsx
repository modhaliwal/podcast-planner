
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuthProxy();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Podcast Management Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Effortlessly manage your podcast episodes, guests, and content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
