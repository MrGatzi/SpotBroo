import React, { useEffect } from 'react';
import { View } from 'react-native';
import { DaysList } from '@/components/days/DaysList';
import { Current } from '@/components/current/current';
import { registerBackgroundFetchAsync, BACKGROUND_FETCH_TASK } from '../services/backgroundFetch';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Chart } from '@/components/chart/chart';
import { AlarmPermissionChecker } from '@/components/permission/AlarmPermissionChecker';

const Index = () => {

  useEffect(() => {
    setBackgroundTask();
  }, []);

  const setBackgroundTask = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (isRegistered) {
      console.log('SB- BG Task already registerd', BACKGROUND_FETCH_TASK);
    } else {
      await registerBackgroundFetchAsync();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* CAREFULL THIS DOES NOT WORK ON EXPO GO ! DISABLE IT ;) */}
      <AlarmPermissionChecker /> 
      <Current />
      <Chart/>
      <DaysList />
    </View>
  );
}

export default Index;