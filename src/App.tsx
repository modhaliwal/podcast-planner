
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingIndicator } from './components/ui/loading-indicator';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Direct imports instead of lazy loading
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import GuestView from './pages/GuestView';
import AddGuest from './pages/AddGuest';
import EditGuest from './pages/EditGuest';
import Episodes from './pages/Episodes';
import CreateEpisode from './pages/CreateEpisode';
import EpisodeView from './pages/EpisodeView';
import EditEpisode from './pages/EditEpisode';
import Settings from './pages/Settings';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingIndicator fullPage />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
          <Route path="/guests/new" element={<ProtectedRoute><AddGuest /></ProtectedRoute>} />
          <Route path="/guests/:id" element={<ProtectedRoute><GuestView /></ProtectedRoute>} />
          <Route path="/guests/:id/edit" element={<ProtectedRoute><EditGuest /></ProtectedRoute>} />
          <Route path="/episodes" element={<ProtectedRoute><Episodes /></ProtectedRoute>} />
          <Route path="/episodes/new" element={<ProtectedRoute><CreateEpisode /></ProtectedRoute>} />
          <Route path="/episodes/:id" element={<ProtectedRoute><EpisodeView /></ProtectedRoute>} />
          <Route path="/episodes/:id/edit" element={<ProtectedRoute><EditEpisode /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
