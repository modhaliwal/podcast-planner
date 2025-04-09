
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Bug } from "lucide-react";
import { useFederatedAuth } from "@/contexts/FederatedAuthContext";
import { useAuthProxy } from "@/hooks/useAuthProxy";
import { signInAsDevUser } from "@/integrations/auth/federated-auth";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authError, isLoading: authModuleLoading, isAuthenticated, setAuthToken } = useFederatedAuth();
  const { signInAsDev } = useAuthProxy();
  
  const from = location.state?.from || "/dashboard";

  // If user is authenticated, redirect
  if (isAuthenticated && !authModuleLoading) {
    navigate(from, { replace: true });
    return null;
  }

  const handleDevUserAuth = () => {
    try {
      setLoading(true);
      
      // Create a simulated session
      const token = signInAsDevUser();
      
      // Update auth context with the token
      setAuthToken(token);
      
      toast({
        title: "Authenticated as Dev User",
        description: "You've been signed in with a development account",
      });
      
      // Navigate to the destination
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Dev auth error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to create dev user session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 flex items-center">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl">PodCast Manager</span>
          </div>
          <CardTitle className="text-2xl text-center">Development Login</CardTitle>
          <CardDescription className="text-center">
            Sign in with a development account to access the application
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          <Button 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleDevUserAuth}
            disabled={loading}
          >
            <Bug className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign in as Dev User"}
          </Button>

          {authError && (
            <div className="w-full p-3 border border-amber-300 bg-amber-50 rounded-md text-amber-800 text-sm">
              <p className="font-medium">Authentication Service Notice</p>
              <p className="text-xs mt-1">
                The authentication service is currently unavailable. You may experience limited functionality.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
