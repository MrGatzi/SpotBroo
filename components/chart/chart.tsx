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
    const unit = getSettingValue("Unit");

    useEffect(() => {
        getPricesForDay(selectedDate!).then((data: ChartPoint[]) => {
            setSpotPrices(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [selectedDate, unit]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white', margin: 10 }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ChartComponent data={spotPrices} />
            )}
        </View>
    )
}