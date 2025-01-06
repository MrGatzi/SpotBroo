import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
//import { getCurrentPriceData } from './hooks/usePrices';
import { NativeModules } from 'react-native';

const { SharedPreferences } = NativeModules;

export const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('MGW Background fetch task try started');
  try {
    //const currentPrice = await getCurrentPriceData();
    const currentPrice = Math.random() * 10;
    console.log('MGW Background fetch executed', currentPrice);
    SharedPreferences.setItem('currentPrice', currentPrice.toString());
    console.log('MGW Item set really', currentPrice);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('MGW Background fetch task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundFetchAsync = async () => {
  console.log("MGW Registering background fetch task");
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 20, // 1 minute
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

export const unregisterBackgroundFetchAsync = async () => {
  console.log("MGW Un--registering background fetch task");
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};