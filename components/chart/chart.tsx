import { useDateContext } from "@/contexts/DateContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { LineChart } from 'react-native-chart-kit';

interface ChartProps {
}

export const Chart = (props: ChartProps) => {
    const { selectedDate, setSelectedDate } = useDateContext();

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
        <View style={{ flex: 1 }}>
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
                    height={Dimensions.get('window').height * .8}
                    yAxisLabel="ct "
                    chartConfig={{
                        backgroundColor: '#fff', 
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
        </View>
    );
};