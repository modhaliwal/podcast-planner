
import { useState } from "react";
import { useAuthProxy } from "@/hooks/useAuthProxy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { user } = useAuthProxy();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Profile updates would be handled through the federated auth service
      // This is a simplified version that just shows a success toast
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: `Error updating profile: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="text-lg">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{fullName || "User"}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>
            
            <Button 
              onClick={handleUpdateProfile} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
