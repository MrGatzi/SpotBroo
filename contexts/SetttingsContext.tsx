
import React, { createContext, useContext, ReactNode } from 'react';
import { HeaderSettings } from '@/components/settings/settings.types';
import { useSettings } from '@/hooks/useSettings';

interface SettingsContextProps {
  headerSettings: HeaderSettings[];
  updateSetting: (label: string, newValue: string) => Promise<void>;
  getSettingValue: (label: string) => string | undefined;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { headerSettings, updateSetting, getSettingValue } = useSettings();

  return (
    <SettingsContext.Provider value={{ headerSettings, updateSetting, getSettingValue }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}