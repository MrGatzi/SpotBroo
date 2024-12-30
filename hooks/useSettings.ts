import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingsData from '../components/settings/settings.json';
import { HeaderSettings } from '../components/settings/settings.types';

const useSettings = () => {
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setHeaderSettings(JSON.parse(savedSettings));
      } else {
        // Load settings from JSON file
        const defaultSettings: HeaderSettings[] = settingsData.headers;
        setHeaderSettings(defaultSettings);
        await AsyncStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      }
    };
    loadSettings();
  }, []);

  const updateSetting = async (label: string, newValue: string) => {
    const updatedHeaderSettings = [...headerSettings];
    for (const headerSetting of updatedHeaderSettings) {
      for (const setting of headerSetting.settings) {
        if (setting.label === label) {
          console.log("old setting: ", setting);
          setting.value = newValue;
          setHeaderSettings(updatedHeaderSettings);
          console.log("new settings in hook ", JSON.stringify(headerSettings));
          await AsyncStorage.setItem('userSettings', JSON.stringify(updatedHeaderSettings));
          return;
        }
      }
    }
  };

  const getSettingValue = (label: string): string | undefined => {
    for (const headerSetting of headerSettings) {
      for (const setting of headerSetting.settings) {
        if (setting.label === label) {
          return setting.value;
        }
      }
    }
    return undefined;
  };

  return {
    headerSettings,
    updateSetting,
    getSettingValue,
  };
};

export default useSettings;