"use widget";

import React from "react";
import { createWidget, type WidgetBase } from "expo-widgets";
import { VStack, HStack, Text, Spacer } from "@expo/ui/swift-ui";
import { Chart } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  bold,
  padding,
  frame,
  cornerRadius,
  background,
} from "@expo/ui/swift-ui/modifiers";
import type { ChartDataPoint } from "@expo/ui/swift-ui";

interface SpotBrooWidgetProps {
  currentPrice: string;
  currentHour: number;
  unit: string;
  prices: Array<{ time: number; price: number }>;
}

function SpotBrooWidgetLayout(
  props: WidgetBase<SpotBrooWidgetProps>
) {
  const {
    family,
    currentPrice = "--",
    currentHour = 0,
    unit = "MWh",
    prices = [],
  } = props;

  const hourStr = currentHour.toString().padStart(2, "0") + ":00";

  const chartData: ChartDataPoint[] = prices.map((p) => ({
    x: p.time.toString(),
    y: p.price,
    color: p.time === currentHour ? "#9C27B0" : "#4caf50",
  }));

  const isSmall = family === "systemSmall";

  return (
    <VStack alignment="leading" spacing={4}>
      {/* Header */}
      <HStack spacing={4}>
        <Text
          modifiers={[
            font({ weight: "bold", size: isSmall ? 12 : 14 }),
            foregroundStyle("#1a1a1a"),
          ]}
        >
          SpotBroo
        </Text>
        <Spacer />
        <Text
          modifiers={[
            font({ size: isSmall ? 10 : 12 }),
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
          ]}
        >
          {hourStr}
        </Text>
      </HStack>

      {/* Price */}
      <HStack alignment="bottom" spacing={2}>
        <Text
          modifiers={[
            font({ weight: "bold", size: isSmall ? 22 : 28 }),
            foregroundStyle("#4caf50"),
          ]}
        >
          {currentPrice}
        </Text>
        <Text
          modifiers={[
            font({ size: isSmall ? 10 : 12 }),
            foregroundStyle({ type: "hierarchical", style: "tertiary" }),
            padding({ bottom: isSmall ? 2 : 4 }),
          ]}
        >
          {`EUR/${unit}`}
        </Text>
      </HStack>

      {/* Chart - only for medium and large */}
      {!isSmall && chartData.length > 0 && (
        <Chart
          data={chartData}
          type="bar"
          barStyle={{ cornerRadius: 3 }}
          animate
          modifiers={[
            frame({ maxWidth: 9999, height: family === "systemLarge" ? 140 : 60 }),
            cornerRadius(8),
            background("#F8F9FA"),
          ]}
        />
      )}
    </VStack>
  );
}

export const spotBrooWidget = createWidget<SpotBrooWidgetProps>(
  "SpotBrooWidget",
  SpotBrooWidgetLayout
);
