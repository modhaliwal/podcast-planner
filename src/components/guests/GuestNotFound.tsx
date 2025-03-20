
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/layout/Shell';

export function GuestNotFound() {
  return (
    <Shell>
      <div className="page-container">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-2">Guest not found</h1>
          <p className="text-muted-foreground mb-6">The guest you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/guests">Back to Guests</a>
          </Button>
        </div>
      </div>
    </Shell>
  );
}
