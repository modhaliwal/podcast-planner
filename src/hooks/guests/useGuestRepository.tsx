
import { useState } from 'react';
import { guestRepository } from '@/repositories';
import { Guest } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/toast/use-toast';
import { CreateGuestDTO, UpdateGuestDTO } from '@/repositories/guests/GuestRepository';

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
      return await guestRepository.getAll();
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
      return await guestRepository.getById(id);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new guest
   */
  const createGuest = async (guest: CreateGuestDTO) => {
    setIsLoading(true);
    try {
      const result = await guestRepository.add(guest);
      
      // Invalidate guests cache
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      
      toast({
        title: "Success",
        description: "Guest created successfully"
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update a guest
   */
  const updateGuest = async (id: string, guest: UpdateGuestDTO) => {
    setIsLoading(true);
    try {
      const result = await guestRepository.update(id, guest);
      
      // Invalidate guest cache
      queryClient.invalidateQueries({ queryKey: ['guests', id] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      
      toast({
        title: "Success",
        description: "Guest updated successfully"
      });
      
      return !!result;
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
      const success = await guestRepository.delete(id);
      
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
