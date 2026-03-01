import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getPricesForCurrentHourAsync } from '@/hooks/usePrices';
import { getSettingValueAsync } from '@/hooks/useSettings';

export const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const settingsUnit = await getSettingValueAsync("Unit");
    const currentPrice = await getPricesForCurrentHourAsync(settingsUnit);

    // Widget updates are now handled by react-native-android-widget's
    // built-in update mechanism via the widgetTaskHandler.
    console.log('SB- Background fetch completed. Price:', currentPrice, settingsUnit);

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 20, // 1 minute
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

export const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};
