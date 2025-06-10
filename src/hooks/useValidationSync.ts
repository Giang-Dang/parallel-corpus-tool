import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useChangeValidation } from './useChangeValidation';

/**
 * Hook that synchronizes validation results with AppContext state
 * This keeps validation logic separate but state centralized
 */
export const useValidationSync = () => {
  const { setHasValidationIssues } = useAppContext();
  const { validationIssues, hasCriticalIssues, getChangeIssues } = useChangeValidation();

  // Sync validation state with AppContext
  useEffect(() => {
    setHasValidationIssues(hasCriticalIssues);
  }, [hasCriticalIssues, setHasValidationIssues]);

  return {
    validationIssues,
    hasCriticalIssues,
    getChangeIssues,
  };
};
