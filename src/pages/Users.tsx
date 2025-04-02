
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { UsersList } from '@/components/users/UsersList';

export default function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth page if user is not authenticated
  if (!user) {
    navigate('/auth');
    return null;
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
