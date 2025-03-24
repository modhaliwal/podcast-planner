
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { UserManagement } from '@/components/users/UserManagement';
import { UsersList } from '@/components/users/UsersList';
import { User } from '@/lib/types';

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
            <p className="section-subtitle">Add, view, and manage users for your podcast</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <UserManagement />
          </div>
          <div className="md:col-span-2">
            <UsersList />
          </div>
        </div>
      </div>
    </Shell>
  );
}
