import React, { createContext, useContext } from 'react';

type Flags = Record<string, boolean>;
const defaultFlags: Flags = { authUiV2: false };
const FeatureFlagContext = createContext<Flags>(defaultFlags);

export const FeatureFlagProvider: React.FC<{ flags?: Flags; children: React.ReactNode }> = ({ flags = defaultFlags, children }) => (
  <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>
);

export const useFeatureFlag = (key: string) => {
  const ctx = useContext(FeatureFlagContext);
  return ctx[key];
};
