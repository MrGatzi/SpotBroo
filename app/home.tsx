import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DaysList } from '@/components/days/DaysList';
import { Chart } from '@/components/chart/chart';

export default function Home() {

  return (
    <View style={{ flex: 1 }}>
      <Chart />
      <DaysList />
    </View>
  );
}
const styles = StyleSheet.create({
  carouselItem: {
    backgroundColor: '#fb8c00',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  carouselText: {
    color: '#fff',
    fontSize: 18,
  },
});