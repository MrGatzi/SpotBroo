import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { getPermission, useSEA } from 'react-native-schedule-exact-alarm-permission';

export const AlarmPermissionChecker = () => {
  const SEAstatus = useSEA();

  useEffect(() => {
    requestAlarmPermission();
  }, []);

  const requestAlarmPermission = async () => {
    if (Platform.OS === 'android') {
      console.log('Requesting alarm permission', SEAstatus);
      if (SEAstatus) return;
      getPermission();
    }
  };

  return null;
};