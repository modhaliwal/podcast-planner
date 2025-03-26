import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingIndicator } from './components/ui/loading-indicator';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Lazy loaded pages
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Guests = lazy(() => import('./pages/Guests'));
const GuestView = lazy(() => import('./pages/GuestView'));
const AddGuest = lazy(() => import('./pages/AddGuest'));
const EditGuest = lazy(() => import('./pages/EditGuest'));
const Episodes = lazy(() => import('./pages/Episodes'));
const CreateEpisode = lazy(() => import('./pages/CreateEpisode'));
const EpisodeView = lazy(() => import('./pages/EpisodeView'));
const EditEpisode = lazy(() => import('./pages/EditEpisode'));
const Settings = lazy(() => import('./pages/Settings'));
const Users = lazy(() => import('./pages/Users'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingIndicator fullPage />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/guests" element={
            <ProtectedRoute>
              <Guests />
            </ProtectedRoute>
          } />
          <Route path="/guests/new" element={
            <ProtectedRoute>
              <AddGuest />
            </ProtectedRoute>
          } />
          <Route path="/guests/:id" element={
            <ProtectedRoute>
              <GuestView />
            </ProtectedRoute>
          } />
          <Route path="/guests/:id/edit" element={
            <ProtectedRoute>
              <EditGuest />
            </ProtectedRoute>
          } />
          <Route path="/episodes" element={
            <ProtectedRoute>
              <Episodes />
            </ProtectedRoute>
          } />
          <Route path="/episodes/new" element={
            <ProtectedRoute>
              <CreateEpisode />
            </ProtectedRoute>
          } />
          <Route path="/episodes/:id" element={
            <ProtectedRoute>
              <EpisodeView />
            </ProtectedRoute>
          } />
          <Route path="/episodes/:id/edit" element={
            <ProtectedRoute>
              <EditEpisode />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ShadcnToaster />
        <SonnerToaster position="bottom-right" />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
