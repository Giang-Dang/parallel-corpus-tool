'use client';

import { useCallback, useState } from 'react';

export default function useRibbonMenuAction() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return {
    isCollapsed,
    toggleCollapse,
  };
}
