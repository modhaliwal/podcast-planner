
import { Shell } from '@/components/layout/Shell';

export function GuestViewLoading() {
  return (
    <Shell>
      <div className="page-container">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading guest information...</p>
        </div>
      </div>
    </Shell>
  );
}
