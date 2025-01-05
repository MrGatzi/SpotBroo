import React, { useEffect } from 'react';
import { View } from 'react-native';
import { DaysList } from '@/components/days/DaysList';
import { Chart } from '@/components/chart/chart';
import { Current } from '@/components/current/current';
import { registerBackgroundFetchAsync, unregisterBackgroundFetchAsync,BACKGROUND_FETCH_TASK } from '../services/backgroundFetch';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const Index = () => {

  useEffect(() => {
    setBackgroundTask();
  }, []);

  const setBackgroundTask = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    console.log('BackgroundFetch status:', status);
    console.log('TaskManager isTaskRegistered:', isRegistered);

    if (isRegistered) {
      console.log('already Registerd', BACKGROUND_FETCH_TASK);
    } else {
      await registerBackgroundFetchAsync();
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Current />
      <Chart />
      <DaysList />
    </View>
  );
}

export default Index;