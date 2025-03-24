
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { UsersList } from '@/components/users/UsersList';

export default function Users() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Shell>
        <div className="page-container">
          <LoadingIndicator message="Loading users..." fullPage />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="page-container">
        <div className="page-header mb-6">
          <div>
            <h1 className="section-title">User Management</h1>
            <p className="section-subtitle">View and manage users for your podcast</p>
          </div>
        </div>

        <UsersList />
      </div>
    </Shell>
  );
}
