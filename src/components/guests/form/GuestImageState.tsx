
import { useState } from "react";

interface GuestImageStateProps {
  children: (state: {
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    isImageRemoved: boolean;
    setIsImageRemoved: (value: boolean) => void;
    handleImageChange: (file: File | null, previewUrl?: string) => void;
  }) => React.ReactNode;
}

export function GuestImageState({ children }: GuestImageStateProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const handleImageChange = (file: File | null, previewUrl?: string) => {
    setImageFile(file);
    setIsImageRemoved(file === null);
  };

  return (
    <>
      {children({
        imageFile,
        setImageFile,
        isImageRemoved,
        setIsImageRemoved,
        handleImageChange
      })}
    </>
  );
}
