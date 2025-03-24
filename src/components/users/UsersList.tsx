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
import { MoreHorizontal, Copy, Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(`Failed to fetch users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.rpc('delete_user', { user_id: userId });
    if (error) throw error;
    toast.success('User deleted successfully');
    // Refresh the users list
    refreshUsers();
  } catch (error: any) {
    console.error('Error deleting user:', error);
    toast.error(`Failed to delete user: ${error.message}`);
  }
};

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm)) ||
      user.id.toLowerCase().includes(searchTerm)
    );
  });

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
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
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.full_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
