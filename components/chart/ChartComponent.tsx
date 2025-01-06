import React from "react";
import { ChartPoint } from "@/hooks/types";
import { CartesianChart, Bar, useChartPressState } from "victory-native";
import { Circle, useFont, vec } from "@shopify/react-native-skia";
import { LinearGradient, Text as SKText } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { View } from "react-native";

const inter = require("@/assets/fonts/roboto.ttf");


export interface ChartComponentProps {
    data: ChartPoint[];
}

export const ChartComponent = (props: ChartComponentProps) => {
    const { data } = props
    const font = useFont(inter, 12);
    const toolTipFont = useFont(inter, 18);

    const { state, isActive } = useChartPressState({
        x: 0,
        y: { price: 0 },
    });

    const value = useDerivedValue(() => {
        return "$" + state.y.price.value.value;
    }, [state]);

    const textYPosition = useDerivedValue(() => {
        return state.y.price.position.value - 15;
    }, [value]);

    const textXPosition = useDerivedValue(() => {
        if (!toolTipFont) {
            return 0;
        }
        return (
            state.x.position.value - toolTipFont.measureText(value.value).width / 2
        );
    }, [value, toolTipFont]);

    const currentHour = new Date().getHours();

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
        <CartesianChart
            xKey="time"
            yKeys={["price"]}
            data={data}
            domainPadding={{
                left: 10,
                right: 10,
                top: 18,
                bottom: 10
            }}
            axisOptions={{
                font,
                tickCount: 12,
            }}
            chartPressState={state}
        >
            {({ points, chartBounds }) => {
                return points.price.map((point, index) => {
                    return (
                        <>
                            <Bar
                                key={index}
                                barCount={points.price.length}
                                points={[point]}
                                chartBounds={chartBounds}
                                animate={{ type: "timing", duration: 1000 }}
                                roundedCorners={{
                                    topLeft: 10,
                                    topRight: 10,
                                }}
                            >
                                <LinearGradient
                                    start={vec(0, 100)}
                                    end={vec(0, 600)}
                                    colors={
                                        index == currentHour
                                            ? ["purple", "#A020F050"]
                                            : ["green", "#90ee9050"]
                                    }
                                />
                            </Bar>

                            {isActive ? (
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
                                        cy={state.y.price.position}
                                        r={4}
                                        color={"grey"}
                                        opacity={0.8}
                                    />
                                </>
                            ) : null}
                        </>
                    );
                });
            }}
        </CartesianChart>
        </View>
    );
};
