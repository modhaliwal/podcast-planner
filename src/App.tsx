
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { FederatedAuthProvider } from "@/contexts/FederatedAuthContext";
import { ErrorBoundary } from "@/components/error";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Import pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Guests from "@/pages/Guests";
import AddGuest from "@/pages/AddGuest";
import GuestView from "@/pages/GuestView";
import EditGuest from "@/pages/EditGuest";
import Episodes from "@/pages/Episodes";
import CreateEpisode from "@/pages/CreateEpisode";
import EpisodeView from "@/pages/EpisodeView";
import EditEpisode from "@/pages/EditEpisode";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";
import NotFound from "@/pages/NotFound";

import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <FederatedAuthProvider>
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
          
          {/* Admin-only route with permission check */}
          <Route path="/users" element={
            <ProtectedRoute requiredPermission="admin.users.view">
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </FederatedAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
