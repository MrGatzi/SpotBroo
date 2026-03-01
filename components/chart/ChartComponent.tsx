import React, { useState, useMemo, useCallback } from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, {
  Text as SvgText,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
  Path,
  Rect,
} from "react-native-svg";
import { ChartPoint } from "@/hooks/types";

export interface ChartComponentProps {
  data: ChartPoint[];
}

const PADDING = { top: 35, right: 15, bottom: 30, left: 45 };
const BAR_RADIUS = 5;

export const ChartComponent = ({ data }: ChartComponentProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const chartWidth = screenWidth - 20;
  const chartHeight = 280;
  const plotWidth = chartWidth - PADDING.left - PADDING.right;
  const plotHeight = chartHeight - PADDING.top - PADDING.bottom;

  const currentHour = new Date().getHours();

  const maxPrice = useMemo(
    () => Math.max(...data.map((d) => d.price), 1),
    [data]
  );

  const barSlotWidth = plotWidth / data.length;
  const barWidth = barSlotWidth * 0.72;

  const getBarHeight = useCallback(
    (price: number) => (price / maxPrice) * plotHeight,
    [maxPrice, plotHeight]
  );

  const getBarX = useCallback(
    (index: number) =>
      PADDING.left + index * barSlotWidth + (barSlotWidth - barWidth) / 2,
    [barSlotWidth, barWidth]
  );

  const getBarY = useCallback(
    (price: number) => PADDING.top + plotHeight - getBarHeight(price),
    [plotHeight, getBarHeight]
  );

  const roundedTopBarPath = useCallback(
    (x: number, y: number, w: number, h: number, r: number) => {
      const radius = Math.min(r, w / 2, h);
      if (h <= 0) return "";
      if (h < radius * 2) {
        const smallR = h / 2;
        return [
          `M ${x} ${y + h}`,
          `L ${x} ${y + smallR}`,
          `Q ${x} ${y} ${x + smallR} ${y}`,
          `L ${x + w - smallR} ${y}`,
          `Q ${x + w} ${y} ${x + w} ${y + smallR}`,
          `L ${x + w} ${y + h}`,
          `Z`,
        ].join(" ");
      }
      return [
        `M ${x} ${y + h}`,
        `L ${x} ${y + radius}`,
        `Q ${x} ${y} ${x + radius} ${y}`,
        `L ${x + w - radius} ${y}`,
        `Q ${x + w} ${y} ${x + w} ${y + radius}`,
        `L ${x + w} ${y + h}`,
        `Z`,
      ].join(" ");
    },
    []
  );

  const yTicks = useMemo(() => {
    const count = 5;
    const step = maxPrice / count;
    return Array.from({ length: count + 1 }, (_, i) =>
      Math.round(step * i * 100) / 100
    );
  }, [maxPrice]);

  const handleBarPress = useCallback(
    (index: number) => {
      setSelectedIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4caf50" stopOpacity="1" />
            <Stop offset="1" stopColor="#90ee90" stopOpacity="0.3" />
          </LinearGradient>
          <LinearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#800080" stopOpacity="1" />
            <Stop offset="1" stopColor="#A020F0" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Y-axis grid lines and labels */}
        {yTicks.map((val, i) => {
          const y =
            PADDING.top + plotHeight - (val / maxPrice) * plotHeight;
          return (
            <G key={`ytick-${i}`}>
              <Line
                x1={PADDING.left}
                y1={y}
                x2={chartWidth - PADDING.right}
                y2={y}
                stroke="#e8e8e8"
                strokeWidth={1}
              />
              <SvgText
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#999"
              >
                {val.toFixed(0)}
              </SvgText>
            </G>
          );
        })}

        {/* Bars */}
        {data.map((point, index) => {
          const x = getBarX(index);
          const y = getBarY(point.price);
          const h = getBarHeight(point.price);
          const isCurrent = index === currentHour;
          const path = roundedTopBarPath(x, y, barWidth, h, BAR_RADIUS);
          if (!path) return null;

          return (
            <G key={`bar-${index}`}>
              <Path
                d={path}
                fill={isCurrent ? "url(#purpleGrad)" : "url(#greenGrad)"}
              />
              {/* Invisible wider touch target */}
              <Rect
                x={PADDING.left + index * barSlotWidth}
                y={PADDING.top}
                width={barSlotWidth}
                height={plotHeight}
                fill="transparent"
                onPress={() => handleBarPress(index)}
              />
            </G>
          );
        })}

        {/* X-axis labels */}
        {data.map((point, index) => {
          if (data.length > 12 && index % 2 !== 0) return null;
          const x = getBarX(index) + barWidth / 2;
          return (
            <SvgText
              key={`xlabel-${index}`}
              x={x}
              y={chartHeight - 8}
              textAnchor="middle"
              fontSize={9}
              fill="#999"
            >
              {point.time}
            </SvgText>
          );
        })}

        {/* X-axis base line */}
        <Line
          x1={PADDING.left}
          y1={PADDING.top + plotHeight}
          x2={chartWidth - PADDING.right}
          y2={PADDING.top + plotHeight}
          stroke="#ccc"
          strokeWidth={1}
        />

        {/* Tooltip */}
        {selectedIndex !== null && data[selectedIndex] && (() => {
          const point = data[selectedIndex];
          const cx = getBarX(selectedIndex) + barWidth / 2;
          const cy = getBarY(point.price);
          const label = `$${point.price.toFixed(2)}`;
          const labelWidth = label.length * 7.5;
          let labelX = cx;
          if (labelX - labelWidth / 2 < PADDING.left)
            labelX = PADDING.left + labelWidth / 2;
          if (labelX + labelWidth / 2 > chartWidth - PADDING.right)
            labelX = chartWidth - PADDING.right - labelWidth / 2;

          return (
            <G>
              <SvgText
                x={labelX}
                y={cy - 12}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill="black"
              >
                {label}
              </SvgText>
              <Circle cx={cx} cy={cy} r={4} fill="grey" opacity={0.8} />
            </G>
          );
        })()}
      </Svg>
    </View>
  );
};
