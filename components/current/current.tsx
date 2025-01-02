import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useDataContext } from '@/context/PriceContext';
import { styles } from './current.styles';

export const Current = () => {
  const { getPricesForCurrentHour } = useDataContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    const fetchCurrentPrice = async () => {
        const price = await getPricesForCurrentHour();
        setCurrentPrice(price);
    };

    updateCurrentTime();
    fetchCurrentPrice();

    const timeInterval = setInterval(updateCurrentTime, 60000); // Update time every minute
    const priceInterval = setInterval(fetchCurrentPrice, 60000); // Update price every minute

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formattedTime}</Text>
      <Text style={styles.priceText}>{currentPrice !== null ? `${currentPrice} EUR/MWh` : 'Loading...'}</Text>
    </View>
  );
};