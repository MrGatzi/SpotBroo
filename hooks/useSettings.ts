import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultSettings } from '../components/settings/defaultSettings';
import { HeaderSettings } from '../components/settings/settings.types';

export const useSettings = () => {
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const mergedSettings = mergeSettings(defaultSettings, parsedSettings);
        setHeaderSettings(mergedSettings);
        await AsyncStorage.setItem('userSettings', JSON.stringify(mergedSettings));
      } else {
        setHeaderSettings(defaultSettings);
        await AsyncStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      }
    };
    loadSettings();
  }, []);

  const mergeSettings = (defaultSettings: HeaderSettings[], userSettings: HeaderSettings[]): HeaderSettings[] => {
    const mergedSettings = [...defaultSettings];

    userSettings.forEach(userHeader => {
      const defaultHeader = mergedSettings.find(header => header.header === userHeader.header);
      if (defaultHeader) {
        userHeader.settings.forEach(userSetting => {
          const defaultSetting = defaultHeader.settings.find(setting => setting.label === userSetting.label);
          if (defaultSetting) {
            defaultSetting.value = userSetting.value;
          } else {
            defaultHeader.settings.push(userSetting);
          }
        });
      } else {
        mergedSettings.push(userHeader);
      }
    });

    return mergedSettings;
  };

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