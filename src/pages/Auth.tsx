
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuthProxy } from "@/hooks/useAuthProxy";
import { useFederatedAuth } from "@/contexts/FederatedAuthContext";

const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authError, isLoading: authModuleLoading, authToken } = useFederatedAuth();
  const auth = useAuthProxy();
  
  const from = location.state?.from || "/dashboard";

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // If user is authenticated (either by token or module), redirect
    if ((auth.user || authToken) && !authModuleLoading) {
      navigate(from, { replace: true });
    }
  }, [auth.user, authToken, navigate, from, authModuleLoading]);

  async function handleAuth(values: AuthFormValues) {
    try {
      setLoading(true);
      await auth.signIn(values.email, values.password);
    } catch (error) {
      console.error(`Authentication error:`, error);
    } finally {
      setLoading(false);
    }
  }

  const handleExternalAuth = () => {
    const currentUrl = window.location.origin;
    const callbackUrl = `${currentUrl}/auth/callback?redirectTo=${encodeURIComponent(from)}`;
    
    // Redirect to the federated auth provider
    const authProviderUrl = "https://admin.skyrocketdigital.com/auth";
    window.location.href = `${authProviderUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  // Show auth module error if it exists
  useEffect(() => {
    if (authError && !authModuleLoading) {
      toast({
        title: "Authentication Service Warning",
        description: "Authentication service is currently unavailable. Some features may be limited.",
        variant: "destructive",
      });
    }
  }, [authError, authModuleLoading]);

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
            className="w-full flex items-center justify-center gap-2"
            onClick={handleExternalAuth}
          >
            <ExternalLink className="h-4 w-4" />
            Sign in with Authentication Provider
          </Button>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={loading || authModuleLoading}
                variant="outline"
              >
                {loading ? "Signing in..." : "Sign In with Email"}
              </Button>
            </form>
          </Form>

          {authError && (
            <div className="w-full p-3 border border-amber-300 bg-amber-50 rounded-md text-amber-800 text-sm">
              <p className="font-medium">Authentication Service Notice</p>
              <p className="text-xs mt-1">
                The authentication service is currently unavailable. You may experience limited functionality.
              </p>
            </div>
          )}
          
          {/* Debug section - hidden in production */}
          {process.env.NODE_ENV !== 'production' && authToken && (
            <div className="w-full p-3 border border-green-300 bg-green-50 rounded-md text-green-800 text-sm">
              <p className="font-medium">Debug: Token Present</p>
              <p className="text-xs mt-1 truncate">
                Token: {authToken.access_token.substring(0, 20)}...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
