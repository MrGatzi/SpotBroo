import { useDataContext } from "@/context/PriceContext";
import { useDateContext } from "@/context/DateContext";
import { ChartPoint } from "@/hooks/types";
import { useEffect, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { BarChart } from 'react-native-chart-kit';
import { styles } from "./chart.styles";
import { useSettingsContext } from "@/context/SetttingsContext";

export const Chart = () => {
    const { selectedDate } = useDateContext();
    const { getPricesForDay } = useDataContext();
    const { getSettingValue } = useSettingsContext();
    const [spotPrices, setSpotPrices] = useState<ChartPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const unit = getSettingValue("Unit");

    useEffect(() => {
        getPricesForDay(selectedDate!).then((data: ChartPoint[]) => {
            setSpotPrices(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [selectedDate, unit]);

    // Limit labels to every 3 hours
    const limitedLabels = spotPrices.map((item, index) => (index % 3 === 0 ? item.time : ''));

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
                    height={Dimensions.get('window').height * 0.7}
                    fromZero={true}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        barPercentage: 0.25, // Adjust bar width
                        showValuesOnTopOfBars: true // Show values on top of bars
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            )}
        </View>
    );
};
