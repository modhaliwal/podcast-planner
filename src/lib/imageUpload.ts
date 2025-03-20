
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Checks if a URL is a blob URL
 * @param url The URL to check
 * @returns True if it's a blob URL
 */
export const isBlobUrl = (url?: string): boolean => {
  return !!url && url.startsWith('blob:');
};

/**
 * Deletes an image from Supabase storage
 * @param url The public URL of the image to delete
 * @returns True if deleted successfully
 */
export const deleteImage = async (url?: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').slice(3).join('/');
    const bucket = urlObj.pathname.split('/')[2];
    
    if (!path || !bucket) return false;
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    return !error;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Uploads an image file to Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder within the bucket
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  bucket: string = 'podcast-planner',
  folder: string = 'headshots'
): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Make sure we're not trying to upload a blob URL directly
    // The file is of type File, so we don't need to check if it's a blob URL
    // Removing the incorrect check that was causing the TypeScript error
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
