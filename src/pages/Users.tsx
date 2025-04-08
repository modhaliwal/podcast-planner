
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { UsersList } from '@/components/users/UsersList';
import { PageLayout } from '@/components/layout/PageLayout';
import { UsersRoleKey } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Users() {
  const { user, appUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roleCheckError, setRoleCheckError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    // Check if the current user has admin role
    import('@/services/userService').then(({ hasUserRole }) => {
      hasUserRole(UsersRoleKey.ADMIN)
        .then(result => {
          console.log('Admin role check result:', result);
          setIsAdmin(result);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error checking admin role:', error);
          setRoleCheckError(error.message || 'Failed to check admin permissions');
          setIsLoading(false);
        });
    });
  }, [user, navigate]);

  // Show a debugging button for admins to manually assign themselves the admin role
  const assignAdminRole = async () => {
    try {
      const { assignUserRole } = await import('@/services/userService');
      const success = await assignUserRole(user.id, UsersRoleKey.ADMIN);
      if (success) {
        toast({
          title: "Success",
          description: "Admin role has been assigned to your account",
        });
        // Refresh the role check
        setIsAdmin(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to assign admin role",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error assigning admin role:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <Shell>
      <PageLayout
        title="User Management"
        subtitle="View and manage users and their access to your podcast"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <p>Checking permissions...</p>
          </div>
        ) : roleCheckError ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-destructive">Error checking permissions: {roleCheckError}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : !isAdmin ? (
          <div className="text-center py-8 space-y-4">
            <p>You don't have permission to view this page.</p>
            <p className="text-sm text-muted-foreground">This page requires admin privileges.</p>
            <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
            
            {/* Only show this button in development environment */}
            {import.meta.env.DEV && (
              <div className="mt-4 p-4 border border-dashed rounded-md">
                <p className="text-sm mb-2">Development Tools</p>
                <Button 
                  size="sm" 
                  onClick={assignAdminRole}
                >
                  Assign Admin Role to Myself
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This button is only visible in development mode
                </p>
              </div>
            )}
          </div>
        ) : (
          <UsersList isAdmin={isAdmin} />
        )}
      </PageLayout>
    </Shell>
  );
}
