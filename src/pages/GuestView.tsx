
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { GuestForm } from '@/components/guests/GuestForm';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Guest } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const { user, episodes, refreshGuests } = useAuth();
  
  useEffect(() => {
    const fetchGuest = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Guest interface
          const formattedGuest: Guest = {
            id: data.id,
            name: data.name,
            title: data.title,
            company: data.company || undefined,
            email: data.email || undefined,
            phone: data.phone || undefined,
            bio: data.bio,
            imageUrl: data.image_url || undefined,
            socialLinks: data.social_links,
            notes: data.notes || undefined,
            backgroundResearch: data.background_research || undefined,
            status: (data.status as Guest['status']) || 'potential',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          
          setGuest(formattedGuest);
        }
      } catch (error: any) {
        toast("Error", {
          description: `Failed to fetch guest: ${error.message}`
        });
        console.error("Error fetching guest:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuest();
  }, [id]);

  const handleSave = async (updatedGuest: Guest) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: updatedGuest.name,
          title: updatedGuest.title,
          company: updatedGuest.company,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          bio: updatedGuest.bio,
          image_url: updatedGuest.imageUrl,
          social_links: updatedGuest.socialLinks,
          notes: updatedGuest.notes,
          background_research: updatedGuest.backgroundResearch,
          status: updatedGuest.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setGuest(updatedGuest);
      setIsEditing(false);
      await refreshGuests();
      toast.success("Guest updated successfully");
    } catch (error: any) {
      toast("Error", {
        description: `Failed to update guest: ${error.message}`
      });
      console.error("Error updating guest:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Show success message
      toast.success("Guest deleted successfully");
      
      // Refresh guests list
      await refreshGuests();
      
      // Redirect to guests list
      navigate('/guests');
    } catch (error: any) {
      toast("Error", {
        description: `Failed to delete guest: ${error.message}`
      });
      console.error("Error deleting guest:", error);
    }
  };
  
  if (isLoading) {
    return (
      <Shell>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Loading guest information...</p>
          </div>
        </div>
      </Shell>
    );
  }
  
  if (!guest) {
    return (
      <Shell>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-semibold mb-2">Guest not found</h1>
            <p className="text-muted-foreground mb-6">The guest you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/guests">Back to Guests</a>
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  // Filter episodes to only include the ones this guest appears in
  const guestEpisodes = episodes.filter(episode => 
    episode.guestIds.includes(guest.id)
  );
  
  return (
    <Shell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="section-title">{guest.name}</h1>
            <p className="section-subtitle">{guest.title}</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel Edit" : "Edit"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <GuestForm 
            guest={guest} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <GuestDetail guest={guest} episodes={guestEpisodes} />
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Guest</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {guest.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
};

export default GuestView;
