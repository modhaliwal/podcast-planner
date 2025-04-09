
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { UsersList } from '@/components/users/UsersList';
import { PageLayout } from '@/components/layout/PageLayout';
import { UsersRoleKey } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { useAuthProxy, useHasPermissionProxy } from '@/hooks/useAuthProxy';

export default function Users() {
  const { user } = useAuthProxy();
  const { hasPermission, isLoading } = useHasPermissionProxy('admin.users.view');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
      return;
    }
    
    if (!hasPermission && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the Users page",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, navigate, hasPermission, isLoading]);

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
  
  if (isLoading) {
    return (
      <Shell>
        <PageLayout
          title="User Management"
          subtitle="Checking permissions..."
        >
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </PageLayout>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageLayout
        title="User Management"
        subtitle="View and manage users and their access to your podcast"
      >
        <PermissionGate 
          permission="admin.users.view"
          fallback={
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
          }
        >
          <UsersList isAdmin={true} />
        </PermissionGate>
      </PageLayout>
    </Shell>
  );
}
