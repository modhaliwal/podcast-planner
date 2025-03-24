
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { MoreHorizontal, Copy, Edit, Trash, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch profiles from the public profiles table instead
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      // Format the profiles to match our User type
      const formattedUsers = data.map(profile => ({
        id: profile.id,
        email: '', // We don't have access to this from the profiles table
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || undefined,
        created_at: profile.created_at,
        last_sign_in: undefined // We don't have access to this from the profiles table
      }));

      setUsers(formattedUsers || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(`Failed to fetch users: ${error.message}`);
      toast.error(`Failed to fetch users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    // This will only work in the context of Edge Functions
    toast.error("Deleting users directly is not supported in the current version.");
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm)) ||
      user.id.toLowerCase().includes(searchTerm)
    );
  });

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profiles</CardTitle>
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
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.full_name || '-'}</TableCell>
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
                              toast.success('User ID copied to clipboard');
                            }}
                            className="cursor-pointer"
                          >
                            <Copy className="mr-2 h-4 w-4" /> Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 cursor-pointer focus:text-red-600"
                            disabled
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Admin Access Required</AlertTitle>
            <AlertDescription>
              Full user management requires admin privileges. This view shows only profile information.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
