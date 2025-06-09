import { useState } from 'react';

export const useDragAndDrop = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
  };
};
