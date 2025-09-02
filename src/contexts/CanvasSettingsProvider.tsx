'use client';

import type { TrailerKey } from '@/components/TrailerSelect/trailers';
import { createContext, useMemo, useState } from 'react';
import { TRAILERS } from '@/components/TrailerSelect/trailers';

export type CanvasSettingsContextType = {
  trailerType: TrailerKey;
  setTrailerType: (t: TrailerKey) => void;
  trailerDimensions: { length: number; width: number; height: number };
};

export const CanvasSettingsContext = createContext<CanvasSettingsContextType | undefined>(undefined);

export function CanvasSettingsProvider({ children }: { children: React.ReactNode }) {
  const [trailerType, setTrailerType] = useState<TrailerKey>('standard');

  const trailerDimensions = TRAILERS[trailerType];

  const contextValue = useMemo(
    () => ({ trailerType, setTrailerType, trailerDimensions }),
    [trailerType, trailerDimensions],
  );

  return (
    <CanvasSettingsContext value={contextValue}>
      {children}
    </CanvasSettingsContext>
  );
}
