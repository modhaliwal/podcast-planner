
import { useState } from 'react';
import { guestRepository } from '@/repositories/GuestRepository';
import { Guest } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook for accessing guest repository with React Query integration
 */
export function useGuestRepository() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  /**
   * Get all guests
   */
  const getAllGuests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await guestRepository.getAll();
      
      if (error) {
        toast({
          title: "Error loading guests",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return data || [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get guest by ID
   */
  const getGuestById = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await guestRepository.getById(id);
      
      if (error) {
        toast({
          title: "Error loading guest",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return data;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new guest
   */
  const createGuest = async (guest: Partial<Guest>) => {
    setIsLoading(true);
    try {
      const { data, error } = await guestRepository.create(guest);
      
      if (error) {
        toast({
          title: "Error creating guest",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      // Invalidate guests cache
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      
      toast({
        title: "Success",
        description: "Guest created successfully"
      });
      
      return data;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update a guest
   */
  const updateGuest = async (id: string, guest: Partial<Guest>) => {
    setIsLoading(true);
    try {
      const { success, error } = await guestRepository.update(id, guest);
      
      if (error) {
        toast({
          title: "Error updating guest",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Invalidate guest cache
      queryClient.invalidateQueries({ queryKey: ['guests', id] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      
      toast({
        title: "Success",
        description: "Guest updated successfully"
      });
      
      return success;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete a guest
   */
  const deleteGuest = async (id: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await guestRepository.delete(id);
      
      if (error) {
        toast({
          title: "Error deleting guest",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Invalidate guests cache
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      
      toast({
        title: "Success",
        description: "Guest deleted successfully"
      });
      
      return success;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    getAllGuests,
    getGuestById,
    createGuest,
    updateGuest,
    deleteGuest
  };
}
