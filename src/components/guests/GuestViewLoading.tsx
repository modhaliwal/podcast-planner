
import { Shell } from '@/components/layout/Shell';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

export function GuestViewLoading() {
  return (
    <Shell>
      <div className="page-container">
        <LoadingIndicator message="Loading guest information..." fullPage />
      </div>
    </Shell>
  );
}
