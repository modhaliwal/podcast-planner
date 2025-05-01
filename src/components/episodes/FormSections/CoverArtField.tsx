
import React, { useRef } from 'react';
import { FormField } from '@/components/form';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';

export interface CoverArtFieldProps {
  coverArt?: string | null;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  form?: UseFormReturn<EpisodeFormValues>;
}

export const CoverArtField = ({ 
  coverArt, 
  onUpload, 
  onRemove, 
  isUploading = false,
  form 
}: CoverArtFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    
    // Clear the input value to allow re-upload of the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // If a form is passed, use it with FormField, otherwise use direct rendering
  if (form) {
    return (
      <FormField
        name="coverArt"
        label="Cover Art"
        description="Upload a square image for your episode cover art."
      >
        {(field) => (
          <div className="flex flex-col items-center justify-center gap-4">
            {coverArt ? (
              <div className="relative w-48 h-48">
                <img
                  src={coverArt}
                  alt="Episode cover art"
                  className="w-full h-full object-cover rounded-md shadow-md"
                />
                {onRemove && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ) : (
              <div
                className="w-48 h-48 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleClick}
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload cover art
                  </p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              {...field}
            />
            
            {!coverArt && (
              <Button
                variant="outline"
                onClick={handleClick}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            )}
          </div>
        )}
      </FormField>
    );
  }

  // Original implementation for when form is not passed
  return (
    <FormField
      label="Cover Art"
      description="Upload a square image for your episode cover art."
    >
      {(field) => (
        <CardContent className="pt-4 pb-6 px-0">
          <div className="flex flex-col items-center justify-center gap-4">
            {coverArt ? (
              <div className="relative w-48 h-48">
                <img
                  src={coverArt}
                  alt="Episode cover art"
                  className="w-full h-full object-cover rounded-md shadow-md"
                />
                {onRemove && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ) : (
              <div
                className="w-48 h-48 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleClick}
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload cover art
                  </p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            
            {!coverArt && (
              <Button
                variant="outline"
                onClick={handleClick}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </FormField>
  );
};
