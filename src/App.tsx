
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

// Lazy loaded pages
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Guests = lazy(() => import('./pages/Guests'));
const GuestView = lazy(() => import('./pages/GuestView'));
const AddGuest = lazy(() => import('./pages/AddGuest'));
const Episodes = lazy(() => import('./pages/Episodes'));
const CreateEpisode = lazy(() => import('./pages/CreateEpisode'));
const EpisodeView = lazy(() => import('./pages/EpisodeView'));
const EditEpisode = lazy(() => import('./pages/EditEpisode'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/guests/new" element={<AddGuest />} />
          <Route path="/guests/:id" element={<GuestView />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episodes/new" element={<CreateEpisode />} />
          <Route path="/episodes/:id" element={<EpisodeView />} />
          <Route path="/episodes/:id/edit" element={<EditEpisode />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
