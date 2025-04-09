
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error";
import { DataProvider } from "@/context/DataContext";

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

import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
