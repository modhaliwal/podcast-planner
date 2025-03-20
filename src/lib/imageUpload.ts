
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
    
    console.log(`Attempting to delete image from ${bucket}/${path}`);
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    console.log(`Successfully deleted image from ${bucket}/${path}`);
    return true;
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
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    console.log(`Uploading ${file.name} to ${bucket}/${filePath}`);
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      throw uploadError;
    }
    
    console.log('Upload successful, file path:', uploadData?.path);
    
    // Get the public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    console.log('Generated public URL:', data.publicUrl);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
