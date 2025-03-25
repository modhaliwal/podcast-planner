
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Auto sign-in for development mode
    if (isDevelopment && !session) {
      handleDevSignIn();
    }

    return () => subscription.unsubscribe();
  }, []);

  // Redirect if session exists
  if (session) {
    return <Navigate to={from} />;
  }

  // Development mode sign in bypass
  async function handleDevSignIn() {
    if (!isDevelopment) return;
    
    try {
      setLoading(true);
      
      // Create a fake session for development
      const fakeSession = {
        access_token: "fake-token-for-development",
        refresh_token: "fake-refresh-token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: {
          id: "00000000-0000-0000-0000-000000000000",
          email: "mo@skyrocket.is",
          user_metadata: {
            full_name: "Mo Dhaliwal",
            avatar_url: "https://via.placeholder.com/150"
          },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString()
        }
      };
      
      // Manually trigger the auth state change
      // This will be caught by the onAuthStateChange listener above
      await supabase.auth.setSession(fakeSession);
      
      toast.success("Development mode: Signed in as mo@skyrocket.is");
    } catch (error) {
      console.error("Dev mode sign in error:", error);
      toast.error("An unexpected error occurred during development sign-in");
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error(error.message || "Failed to sign in with Google");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 flex items-center">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl">PodCast Manager</span>
          </div>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to manage your podcasts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          <Button 
            size="lg"
            variant="outline" 
            className="w-full h-12 flex items-center justify-center gap-2"
            onClick={isDevelopment ? handleDevSignIn : handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="#4285f4"/>
            </svg>
            {loading ? "Signing in..." : (isDevelopment ? "Dev Mode Sign In (mo@skyrocket.is)" : "Sign in with Google")}
          </Button>
          {isDevelopment && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Development mode detected. You can automatically sign in as mo@skyrocket.is.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
