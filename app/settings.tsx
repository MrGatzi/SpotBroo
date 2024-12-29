import React from 'react';
import { View } from 'react-native';
import { SettingsList } from '@/components/settings/SettingsList';

const Settings = () => {
  return (
    <View style={{ flex: 1 }}>
      <SettingsList/>
    </View>
  );
};

export default Settings;