
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { UsersList } from '@/components/users/UsersList';
import { PageLayout } from '@/components/layout/PageLayout';
import { UsersRoleKey } from '@/lib/types';

export default function Users() {
  const { user, appUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if the current user has admin role
    // This will be implemented in the next steps
    import('@/services/userService').then(({ hasUserRole }) => {
      hasUserRole(UsersRoleKey.ADMIN).then(result => {
        setIsAdmin(result);
      });
    });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Shell>
      <PageLayout
        title="User Management"
        subtitle="View and manage users and their access to your podcast"
      >
        <UsersList isAdmin={isAdmin} />
      </PageLayout>
    </Shell>
  );
}
