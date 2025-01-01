import { useDataContext } from "@/contexts/DataContext";
import { useDateContext } from "@/contexts/DateContext";
import { Point } from "@/hooks/types";
import { useEffect, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { BarChart } from 'react-native-chart-kit';
import { styles } from "./chart.styles";

export const Chart = () => {
    const { selectedDate } = useDateContext();
    const { getDataForDay } = useDataContext();
    const [spotPrices, setSpotPrices] = useState<{ time: string; price: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDataForDay(selectedDate!).then((data: Point[]) => {
            // console.log('Data fetched:', data);
            const points = data.map(point => ({
                time: `${point.position - 1}:00`, // Format time as "0:00", "1:00", etc.
                price: point['price.amount']
            }));
            setSpotPrices(points);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [selectedDate]);

    // Limit labels to every 3 hours
    const limitedLabels = spotPrices.map((item, index) => (index % 3 === 0 ? item.time : ''));

    // Get the current date and hour
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const isToday = selectedDate?.toDateString() === currentDate.toDateString();
    console.log('isToday', isToday);

    return (
        <View style={styles.chartContainer}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <BarChart
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
                    height={Dimensions.get('window').height * 0.8}
                    fromZero={true} // Start y-axis from zero
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        barPercentage: 0.5, // Adjust bar width
                        barRadius: 4, // Rounded corners for bars
                        showValuesOnTopOfBars: true // Show values on top of bars
                    }}
                    formatYLabel={yValue => Math.round(yValue).toString()} // Format y-axis labels to whole numbers
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    decorator={() => {
                        if (isToday) {
                          return (
                            <View
                              style={{
                                position: 'absolute',
                                height: '100%',
                                width: 1,
                                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                                left: `${(currentHour / 24) * 100}%`,
                                borderStyle: 'dotted',
                                borderWidth: 1,
                                borderColor: 'rgba(255, 0, 0, 0.5)',
                              }}
                            />
                          );
                        }
                        return null;
                      }}
                />
            )}
        </View>
    );
};