import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getPricesForCurrentHourAsync } from '@/hooks/usePrices';
import { getSettingValueAsync } from '@/hooks/useSettings';
import { NativeModules } from 'react-native';

const { SharedPreferences } = NativeModules;

export const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const settingsUnit = await getSettingValueAsync("Unit");
    const currentPrice = await getPricesForCurrentHourAsync();
    SharedPreferences.setItem('currentPrice', currentPrice.toString());
    SharedPreferences.setItem('settingsUnit', settingsUnit.toString());
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundFetchAsync = async () => {
  setInitialBackgroundData();
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 20, // 1 minute
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

export const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};

export const setInitialBackgroundData = async () => {
  console.log('Setting initial background data');
  const settingsUnit = await getSettingValueAsync("Unit");
  const currentPrice = await getPricesForCurrentHourAsync();

  SharedPreferences.setItem('currentPrice', currentPrice.toString());
  SharedPreferences.setItem('settingsUnit', settingsUnit);
};