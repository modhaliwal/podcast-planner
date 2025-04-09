
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Guest } from '@/lib/types';

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
      // Insert the new guest into the database
      // Using a fixed user_id since we've removed authentication
      const { data, error } = await supabase
        .from('guests')
        .insert({
          name: newGuest.name,
          title: newGuest.title || '',
          company: newGuest.company || null,
          email: newGuest.email || null,
          phone: newGuest.phone || null,
          bio: newGuest.bio || '',
          image_url: newGuest.imageUrl || null,
          social_links: newGuest.socialLinks as any,
          notes: newGuest.notes || null,
          status: newGuest.status || 'potential',
          // Add a fixed user_id since the database still requires it
          user_id: '00000000-0000-0000-0000-000000000000',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Guest added successfully"
      });
      
      // Navigate to the new guest's page
      navigate(`/guests/${data.id}`);
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
