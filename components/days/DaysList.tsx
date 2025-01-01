import React from 'react';
import { View, FlatList } from 'react-native';
import { DayItem } from './DayItem';
import { styles } from './days.styles';

const getLast30Days = () => {
    const days = [];
    for (let i = -1; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
        days.push(date);
    }
    console.log(days);
    return days.reverse();
};

export const DaysList = () => {
    const days = getLast30Days();

    return (
        <View style={styles.daysListContainer}>
            <FlatList
                data={days}
                horizontal
                keyExtractor={(item) => item.toISOString()}
                renderItem={({ item }) => <DayItem date={item} />}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={days.length - 1} // Start at the last item (today)
                getItemLayout={(data, index) => (
                    { length: 80, offset: 80 * index, index } // Assuming each item has a height of 80
                )}
            />
        </View>
    );
};