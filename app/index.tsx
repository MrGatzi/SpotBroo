import React, { useEffect } from 'react';
import { View, PermissionsAndroid, Platform } from 'react-native';
import { DaysList } from '@/components/days/DaysList';
import { Current } from '@/components/current/current';
import { registerBackgroundFetchAsync, BACKGROUND_FETCH_TASK } from '../services/backgroundFetch';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Chart } from '@/components/chart/Chart';
import {
  getPermission,
  useSEA,
} from 'react-native-schedule-exact-alarm-permission';

const Index = () => {
  const SEAstatus = useSEA();

  useEffect(() => {
    setBackgroundTask();
    requestAlarmPermission();
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

  const requestAlarmPermission = async () => {
    if (Platform.OS === 'android') {
      console.log('Requesting alarm permission', SEAstatus);
      if(SEAstatus) return;
      const granted = await getPermission();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Current />
      <Chart/>
      <DaysList />
    </View>
  );
}

export default Index;