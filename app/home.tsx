import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import Carousel from 'react-native-reanimated-carousel';

const weekdays = [
  { day: '20' },
  { day: '21' },
  { day: '22' },
  { day: '23' },
  { day: '24' },
  { day: '25' },
  { day: '26' },
];

export default function Home() {
  const [spotPrices, setSpotPrices] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    axios.get('https://api.awattar.at/v1/marketdata')
      .then(response => {
        const prices = response.data.data.map((item: { start_timestamp: string | number | Date; marketprice: any; }) => ({
          time: new Date(item.start_timestamp).toLocaleTimeString([], { hour: '2-digit' }),
          price: item.marketprice / 10 // Adjusting the price from €/MWh to ct/kWh by dividing by 10
        }));
        setSpotPrices(prices);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Log the length of spotPrices
  console.log('spotPrices.length:', spotPrices.length);

  // Limit the timestamps to every 4 hours for labels
  const limitedLabels = spotPrices
    .map((item, index) => (index % 4 === 0 ? item.time : ''))
    .filter((label, index, self) => self.indexOf(label) === index);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {spotPrices.length > 0 ? (
        <LineChart
          data={{
            labels: limitedLabels,
            datasets: [
              {
                data: spotPrices.map(item => item.price)
              }
            ],
            legend: ["Spot Prices"]
          }}
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height * .7}
          yAxisLabel="ct "
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          formatYLabel={yValue => Math.round(yValue).toString()} // Format y-axis labels to whole numbers
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <Carousel
        data={weekdays}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Text style={styles.carouselText}>{item.day}</Text>
          </View>
        )}
        width={Dimensions.get('window').width}
        height={50}
        style={{ marginTop: 20 }}
      />
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