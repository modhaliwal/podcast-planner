
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useFederatedAuth } from "@/contexts/FederatedAuthContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken } = useFederatedAuth();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from the URL (in a real implementation, this might be a code that needs to be exchanged)
        const token = searchParams.get("token");
        const redirectTo = searchParams.get("redirectTo") || "/dashboard";
        
        if (!token) {
          setError("No authentication token received");
          toast({
            title: "Authentication Failed",
            description: "No authentication token was received from the provider.",
            variant: "destructive",
          });
          
          // Redirect back to login after a short delay
          setTimeout(() => {
            navigate("/auth", { replace: true });
          }, 3000);
          
          return;
        }
        
        // In a real implementation, validate the token with your API
        // For now, we'll just parse it and store it
        try {
          // Decode the token (it's URL-safe base64 encoded)
          const decodedToken = JSON.parse(atob(token));
          
          // Store the token
          setAuthToken({
            access_token: decodedToken.access_token,
            refresh_token: decodedToken.refresh_token,
            expires_at: Date.now() + (decodedToken.expires_in || 3600) * 1000
          });
          
          toast({
            title: "Authentication Successful",
            description: "You have been successfully signed in.",
          });
          
          // Redirect to the original destination
          navigate(redirectTo, { replace: true });
          
        } catch (parseError) {
          console.error("Error parsing token:", parseError);
          setError("Invalid authentication token format");
          toast({
            title: "Authentication Failed",
            description: "The authentication token format is invalid.",
            variant: "destructive",
          });
          
          // Redirect back to login after a short delay
          setTimeout(() => {
            navigate("/auth", { replace: true });
          }, 3000);
        }
      } catch (e) {
        console.error("Auth callback error:", e);
        setError("Authentication process failed");
        
        toast({
          title: "Authentication Failed",
          description: "An error occurred during the authentication process.",
          variant: "destructive",
        });
        
        // Redirect back to login after a short delay
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 3000);
      }
    };
    
    handleCallback();
  }, [searchParams, navigate, setAuthToken]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-destructive mb-2">Authentication Failed</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm">Redirecting back to login page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold mb-2">Completing Authentication</h1>
            <p className="text-muted-foreground">Please wait while we complete the authentication process...</p>
          </>
        )}
      </div>
    </div>
  );
}
