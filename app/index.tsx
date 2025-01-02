import React from 'react';
import { View } from 'react-native';
import { DaysList } from '@/components/days/DaysList';
import { Chart } from '@/components/chart/chart';
import { Current } from '@/components/current/current';

const Index = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Current />
      <Chart />
      <DaysList />
    </View>
  );
}

export default Index;