import { use } from 'react';
import { CanvasSettingsContext } from '@/contexts/CanvasSettingsProvider';

export function useCanvasSettings() {
  const ctx = use(CanvasSettingsContext);
  if (!ctx) {
    throw new Error('useCanvasSettings must be used within CanvasSettingsProvider');
  }
  return ctx;
}
