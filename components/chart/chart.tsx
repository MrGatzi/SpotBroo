import { useDataContext } from "@/context/PriceContext";
import { useDateContext } from "@/context/DateContext";
import { ChartPoint } from "@/hooks/types";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { styles } from "./chart.styles";
import { useSettingsContext } from "@/context/SetttingsContext";
import { CartesianChart, Bar, useChartPressState, Line } from "victory-native";
import { Circle, useFont, vec } from "@shopify/react-native-skia";
import { LinearGradient, Text as SKText } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

const DATA = (length: number = 10) =>
    Array.from({ length }, (_, index) => ({
        price: index + 1,
        time: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    }));

export const Chart = () => {
    const [data, setData] = useState(DATA(5));
    const font = useFont(12);
    const { state, isActive } = useChartPressState({
        x: 0,
        y: { time: 0 },
      });
      const toolTipFont = useFont(24);
    
      const value = useDerivedValue(() => {
        return "$" + state.y.time.value.value;
      }, [state]);
    
      const textYPosition = useDerivedValue(() => {
        return state.y.time.position.value - 15;
      }, [value]);
    
      const textXPosition = useDerivedValue(() => {
        if (!toolTipFont) {
          return 0;
        }
        return (
          state.x.position.value - toolTipFont.measureText(value.value).width / 2
        );
      }, [value, toolTipFont]);
    const { selectedDate } = useDateContext();
    const { getPricesForDay } = useDataContext();
    const { getSettingValue } = useSettingsContext();
    const [spotPrices, setSpotPrices] = useState<ChartPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const unit = getSettingValue("Unit");

    useEffect(() => {
        getPricesForDay(selectedDate!).then((data: ChartPoint[]) => {
            console.log('data:', data);
            setData(data);
            setSpotPrices(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [selectedDate, unit]);

    // Limit labels to every 3 hours
    //const limitedLabels = spotPrices.map((item, index) => (index % 3 === 0 ? item.time : ''));
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CartesianChart
                xKey="time"
                yKeys={["price"]}
                data={data}
            >
                {({ points, chartBounds }) => {
                    return (
                        <>
                            <Bar
                                points={points.price}
                                chartBounds={chartBounds}
                                animate={{ type: "timing", duration: 1000 }}
                                roundedCorners={{
                                    topLeft: 10,
                                    topRight: 10,
                                }}
                            >
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(0, 400)}
                                    colors={["green", "#90ee9050"]}
                                />
                            </Bar>

                            {isActive ? (
                                console.log('value:', value),
                                <>
                                    <SKText
                                        font={toolTipFont}
                                        color={"black"}
                                        x={textXPosition}
                                        y={textYPosition}
                                        text={value}
                                    />
                                    <Circle
                                        cx={state.x.position}
                                        cy={state.y.time.position}
                                        r={8}
                                        color={"grey"}
                                        opacity={0.8}
                                    />
                                </>
                            ) : null}
                        </>
                    );
                }}
            </CartesianChart>
        </View>
    );
};
