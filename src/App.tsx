
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error";
import { DataProvider } from "@/context/DataContext";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import React, { Suspense } from "react";

// Import pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Guests from "@/pages/Guests";
import AddGuest from "@/pages/AddGuest";
import GuestView from "@/pages/GuestView";
import EditGuest from "@/pages/EditGuest";
import Episodes from "@/pages/Episodes";
import CreateEpisode from "@/pages/CreateEpisode";
import EpisodeView from "@/pages/EpisodeView";
import EditEpisode from "@/pages/EditEpisode";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

// Import the Auth component from the remote module
// Using 'launchpad/Auth' which maps to the launchpad remote defined in vite.config.ts
const LaunchpadAuth = React.lazy(() => import('launchpad/Auth'));

import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route - Landing page with authentication */}
            <Route path="/" element={
              <Suspense fallback={<div>Loading authentication...</div>}>
                <LaunchpadAuth
                  render={(auth) => (
                    auth.isAuthenticated 
                      ? <Navigate to="/dashboard" replace /> 
                      : <Index />
                  )}
                />
              </Suspense>
            } />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/guests/new" element={<AddGuest />} />
              <Route path="/guests/:id" element={<GuestView />} />
              <Route path="/guests/:id/edit" element={<EditGuest />} />
              <Route path="/episodes" element={<Episodes />} />
              <Route path="/episodes/new" element={<CreateEpisode />} />
              <Route path="/episodes/:id" element={<EpisodeView />} />
              <Route path="/episodes/:id/edit" element={<EditEpisode />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
