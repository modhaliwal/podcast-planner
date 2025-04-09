
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Bug } from "lucide-react";
import { useFederatedAuth } from "@/contexts/FederatedAuthContext";
import { signInAsDevUser } from "@/integrations/auth/federated-auth";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    authError, 
    isLoading: authModuleLoading, 
    isAuthenticated, 
    setAuthToken 
  } = useFederatedAuth();
  
  const from = location.state?.from || "/dashboard";

  // Handle callback parameters if present
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from the URL
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refresh_token");
        const expiresIn = searchParams.get("expires_in");
        const redirectTo = searchParams.get("redirectTo") || "/dashboard";
        
        if (!token) {
          // Not a callback request, skip processing
          return;
        }

        setLoading(true);
        
        try {
          // Store the token data
          setAuthToken({
            access_token: token,
            refresh_token: refreshToken || '',
            expires_at: Date.now() + (parseInt(expiresIn || '3600') * 1000)
          });
          
          toast({
            title: "Authentication Successful",
            description: "You have been successfully signed in.",
          });
          
          // Redirect to the original destination
          navigate(redirectTo, { replace: true });
          
        } catch (parseError) {
          console.error("Error processing token:", parseError);
          
          toast({
            title: "Authentication Failed",
            description: "There was an error processing your authentication data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth callback error:", e);
        
        toast({
          title: "Authentication Failed",
          description: "An error occurred during the authentication process.",
          variant: "destructive",
        });
        
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [searchParams, navigate, setAuthToken]);

  // If user is authenticated and not processing a callback, redirect
  useEffect(() => {
    const isCallback = searchParams.get("token") !== null;
    
    if (isAuthenticated && !authModuleLoading && !isCallback && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authModuleLoading, from, navigate, searchParams, loading]);

  // Handle dev user authentication
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

  // Show loading state when processing a callback
  const isProcessingCallback = searchParams.get("token") !== null && loading;
  
  if (isProcessingCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">Completing Authentication</h1>
          <p className="text-muted-foreground">Please wait while we complete the authentication process...</p>
        </div>
      </div>
    );
  }

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
