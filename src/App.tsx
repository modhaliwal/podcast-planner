
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error";

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
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
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
