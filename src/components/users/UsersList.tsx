
import { useState, useEffect } from 'react';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { getUsers, deleteUser, UserWithRoles } from '@/services/userService';
import { User, UsersRoleKey } from '@/lib/types';
import { CreateUserDialog } from './CreateUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UsersListProps {
  isAdmin: boolean;
}

export function UsersList({ isAdmin }: UsersListProps) {
  const { user } = useAuthProxy();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState({
    isOpen: false,
    userName: '',
    userId: '',
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const success = await deleteUser(deleteDialogState.userId);
      if (success) {
        setUsers(users.filter(u => u.id !== deleteDialogState.userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteDialogState({
        isOpen: false,
        userName: '',
        userId: '',
      });
    }
  };

  const openDeleteDialog = (userId: string, userName: string) => {
    setDeleteDialogState({
      isOpen: true,
      userId,
      userName: userName || userId,
    });
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">No users found</div>
      ) : (
        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Last Sign In</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="p-3">
                    {user.full_name || 'Unnamed User'}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.roles?.some(r => r.role === UsersRoleKey.ADMIN) ? (
                      <Badge variant="default">Admin</Badge>
                    ) : (
                      <Badge variant="outline">Standard</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    {user.last_sign_in 
                      ? new Date(user.last_sign_in).toLocaleDateString() 
                      : 'Never'}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(user.id, user.full_name || user.email)}
                      className="text-destructive"
                      disabled={user.id === (user as User).id} // Prevent deleting yourself
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Dialog */}
      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchUsers}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        userName={deleteDialogState.userName}
        isOpen={deleteDialogState.isOpen}
        onOpenChange={(open) => setDeleteDialogState({ ...deleteDialogState, isOpen: open })}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
