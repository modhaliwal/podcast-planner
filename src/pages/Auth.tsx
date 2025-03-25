
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
    try {
      setLoading(true);
      
      // This uses the Supabase admin functionality which only works in development
      // It bypasses the normal OAuth flow for easier testing
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "mo@skyrocket.is",
        password: "development-mode-bypass", // This won't actually be checked in dev mode
      });
      
      if (error) {
        console.log("Dev mode sign in failed, falling back to normal auth");
        // If dev mode auth fails (which it might in certain environments), we don't show an error
        setLoading(false);
      } else {
        console.log("Dev mode sign in successful");
      }
    } catch (error) {
      console.error("Dev mode sign in error:", error);
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
