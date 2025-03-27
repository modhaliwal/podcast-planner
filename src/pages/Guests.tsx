
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { GuestHeader } from '@/components/guests/GuestHeader';
import { GuestContent } from '@/components/guests/GuestContent';

const Guests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasInitializedRef = useRef(false);
  
  // Load guests data once on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!hasInitializedRef.current && user?.id) {
        console.log("Initial Guests page mount, refreshing guest data");
        hasInitializedRef.current = true;
      }
    };
    
    loadData();
  }, [user]);

  const handleAddGuest = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to add guests"
      });
      return;
    }
    
    navigate('/guests/new');
  };
  
  return (
    <Shell>
      <div className="page-container">
        <GuestHeader 
          onAddGuest={handleAddGuest}
        />
        
        <GuestContent />
      </div>
    </Shell>
  );
};

export default Guests;
