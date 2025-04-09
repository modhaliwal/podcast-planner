
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Guest } from '@/lib/types';
import { repositories } from '@/repositories';

const AddGuest = () => {
  const navigate = useNavigate();
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
    setIsSubmitting(true);
    
    try {
      // Use the GuestRepository to add the new guest
      const guestData = {
        name: newGuest.name,
        title: newGuest.title,
        company: newGuest.company,
        email: newGuest.email,
        phone: newGuest.phone,
        bio: newGuest.bio || '',
        imageUrl: newGuest.imageUrl,
        notes: newGuest.notes,
        status: newGuest.status || 'potential',
        socialLinks: newGuest.socialLinks
      };
      
      const createdGuest = await repositories.guests.add(guestData);
      
      toast({
        title: "Success",
        description: "Guest added successfully"
      });
      
      // Navigate to the new guest's page
      navigate(`/guests/${createdGuest.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add guest: ${error.message}`,
        variant: "destructive"
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
