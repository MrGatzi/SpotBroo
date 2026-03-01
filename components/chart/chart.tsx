import { useDateContext } from "@/context/DateContext";
import { useDataContext } from "@/context/PriceContext";
import { useSettingsContext } from "@/context/SetttingsContext";
import { ChartPoint } from "@/hooks/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { ChartComponent } from "./ChartComponent";

export const Chart = () => {
    const { selectedDate } = useDateContext();
    const { getPricesForDay } = useDataContext();
    const { getSettingValue } = useSettingsContext();
    const [spotPrices, setSpotPrices] = useState<ChartPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const unit = getSettingValue("Unit");

    useEffect(() => {
        setLoading(true);
        setError(null);
        getPricesForDay(selectedDate!).then((data: ChartPoint[]) => {
            setSpotPrices(data);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching data:', err);
            setError('Failed to load prices. Check your network connection.');
            setLoading(false);
        });
    }, [selectedDate, unit]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white', margin: 10 }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            ) : error ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{error}</Text>
                </View>
            ) : (
                <ChartComponent data={spotPrices} />
            )}
        </View>
    )
}
