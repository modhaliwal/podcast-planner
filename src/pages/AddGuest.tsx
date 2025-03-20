
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Guest } from '@/lib/types';
import { uploadImage } from '@/lib/imageUpload';

const AddGuest = () => {
  const navigate = useNavigate();
  const { user, refreshGuests } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create an empty guest template
  const emptyGuest: Guest = {
    id: '',
    name: '',
    title: '',
    bio: '',
    socialLinks: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const handleSave = async (newGuest: Guest) => {
    if (!user) {
      toast("Authentication Required", {
        description: "You need to be logged in to add guests"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the new guest into the database
      const { data, error } = await supabase
        .from('guests')
        .insert({
          name: newGuest.name,
          title: newGuest.title,
          company: newGuest.company,
          email: newGuest.email,
          phone: newGuest.phone,
          bio: newGuest.bio,
          image_url: newGuest.imageUrl,
          social_links: newGuest.socialLinks as any, // Cast to any to bypass TypeScript error
          notes: newGuest.notes,
          background_research: newGuest.backgroundResearch,
          status: newGuest.status || 'potential',
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await refreshGuests();
      
      toast.success("Guest added successfully");
      
      // Navigate to the new guest's page
      navigate(`/guests/${data.id}`);
    } catch (error: any) {
      toast("Error", {
        description: `Failed to add guest: ${error.message}`
      });
      console.error("Error adding guest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="section-title">Add New Guest</h1>
          <p className="section-subtitle">Create a new guest profile for your podcast</p>
        </div>
        
        <GuestForm 
          guest={emptyGuest}
          onSave={handleSave}
          onCancel={() => navigate('/guests')}
        />
      </div>
    </Shell>
  );
};

export default AddGuest;
