
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import GuestView from "./pages/GuestView";
import Episodes from "./pages/Episodes";
import EpisodeView from "./pages/EpisodeView";
import EditEpisode from "./pages/EditEpisode";
import CreateEpisode from "./pages/CreateEpisode";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can show a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
      <Route path="/guests/:id" element={<ProtectedRoute><GuestView /></ProtectedRoute>} />
      <Route path="/episodes" element={<ProtectedRoute><Episodes /></ProtectedRoute>} />
      <Route path="/episodes/:id" element={<ProtectedRoute><EpisodeView /></ProtectedRoute>} />
      <Route path="/episodes/:id/edit" element={<ProtectedRoute><EditEpisode /></ProtectedRoute>} />
      <Route path="/episodes/create" element={<ProtectedRoute><CreateEpisode /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
