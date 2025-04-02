
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { User, UsersRoleKey } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertCircle, Copy, MoreHorizontal, UserPlus, Check, X } from 'lucide-react';
import { 
  listUsers, 
  deleteUser, 
  assignRole, 
  removeRole 
} from '@/services/userService';
import { CreateUserDialog } from './CreateUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { Badge } from '@/components/ui/badge';

interface UsersListProps {
  isAdmin?: boolean;
}

export function UsersList({ isAdmin = false }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        // For admin users, fetch the full user list with roles
        const { users: adminUsers, error } = await listUsers();
        if (error) throw error;
        setUsers(adminUsers || []);
      } else {
        // For non-admin users, just fetch profiles from the public profiles table
        const { data, error } = await fetch("/api/profiles").then(res => res.json());
        if (error) throw error;
        setUsers(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(`Failed to fetch users: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to fetch users: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setIsCreateDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { success, error } = await deleteUser(selectedUser.id);
      
      if (error) throw error;
      
      if (success) {
        toast({
          title: "Success",
          description: `User ${selectedUser.email} has been deleted`
        });
        await refreshUsers();
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const toggleUserRole = async (user: User, role: UsersRoleKey) => {
    try {
      // Check if user already has this role
      const hasRole = user.roles?.some(r => r.role === role);
      
      let result;
      if (hasRole) {
        // Remove the role
        result = await removeRole(user.id, role);
        if (result.success) {
          toast({
            title: "Success",
            description: `Removed ${role} role from ${user.email}`
          });
        }
      } else {
        // Assign the role
        result = await assignRole(user.id, role);
        if (result.success) {
          toast({
            title: "Success",
            description: `Assigned ${role} role to ${user.email}`
          });
        }
      }
      
      if (result.error) throw result.error;
      
      await refreshUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: `Failed to update user role: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      user.id.toLowerCase().includes(searchTerm)
    );
  });

  const hasRole = (user: User, role: UsersRoleKey) => {
    return user.roles?.some(r => r.role === role);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col space-y-2 items-center">
              <div className="h-4 w-20 bg-muted rounded"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        {isAdmin && (
          <Button onClick={handleCreateUser} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  {isAdmin && <TableHead>Roles</TableHead>}
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.full_name || '(No name)'}</div>
                    </TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hasRole(user, UsersRoleKey.ADMIN) ? (
                            <Badge variant="default" className="bg-primary">Admin</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">Standard</Badge>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(user.id);
                              toast({
                                title: "Success",
                                description: "User ID copied to clipboard"
                              });
                            }}
                            className="cursor-pointer"
                          >
                            <Copy className="mr-2 h-4 w-4" /> Copy ID
                          </DropdownMenuItem>
                          
                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toggleUserRole(user, UsersRoleKey.ADMIN)}
                                className="cursor-pointer"
                              >
                                {hasRole(user, UsersRoleKey.ADMIN) ? (
                                  <>
                                    <X className="mr-2 h-4 w-4" /> Remove Admin Role
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" /> Make Admin
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <AlertCircle className="mr-2 h-4 w-4" /> Delete User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isAdmin && (
          <div className="mt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Admin Access Required</AlertTitle>
              <AlertDescription>
                Full user management requires admin privileges. Contact your administrator for access.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>

      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refreshUsers}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        userName={selectedUser?.full_name || selectedUser?.email || 'this user'}
      />
    </Card>
  );
}
