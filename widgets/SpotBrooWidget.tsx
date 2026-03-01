import React from "react";
import {
  FlexWidget,
  TextWidget,
  SvgWidget,
} from "react-native-android-widget";
import { ChartPoint } from "@/hooks/types";

interface SpotBrooWidgetProps {
  currentPrice: string;
  currentHour: number;
  unit: string;
  prices: ChartPoint[];
}

function generateMiniChartSvg(
  prices: ChartPoint[],
  currentHour: number,
  width: number,
  height: number
): string {
  if (prices.length === 0) return "";

  const padding = { top: 4, bottom: 4, left: 2, right: 2 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = Math.max(...prices.map((p) => p.price), 1);

  const barSlot = plotW / prices.length;
  const barW = barSlot * 0.72;
  const gap = (barSlot - barW) / 2;

  let bars = "";
  for (const p of prices) {
    const idx = p.time;
    const barH = (p.price / max) * plotH;
    const x = padding.left + idx * barSlot + gap;
    const y = padding.top + plotH - barH;
    const r = Math.min(2, barW / 2, barH);
    const isCurrent = idx === currentHour;
    const fill = isCurrent ? "#9C27B0" : "#4caf50";

    if (barH > 0) {
      bars += `<path d="M ${x} ${y + barH} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + barW - r} ${y} Q ${x + barW} ${y} ${x + barW} ${y + r} L ${x + barW} ${y + barH} Z" fill="${fill}" opacity="0.85"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${bars}</svg>`;
}

export function SpotBrooWidget({
  currentPrice,
  currentHour,
  unit,
  prices,
}: SpotBrooWidgetProps) {
  const hourStr = currentHour.toString().padStart(2, "0") + ":00";
  const chartSvg = generateMiniChartSvg(prices, currentHour, 280, 80);

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        padding: 12,
      }}
      clickAction="OPEN_APP"
    >
      {/* Header row */}
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "match_parent",
        }}
      >
        <TextWidget
          text="SpotBroo"
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#1a1a1a",
          }}
        />
        <TextWidget
          text={hourStr}
          style={{
            fontSize: 12,
            color: "#666666",
          }}
        />
      </FlexWidget>

      {/* Price display */}
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          marginTop: 4,
        }}
      >
        <TextWidget
          text={currentPrice}
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#4caf50",
          }}
        />
        <TextWidget
          text={` EUR/${unit}`}
          style={{
            fontSize: 12,
            color: "#888888",
            marginBottom: 4,
            marginLeft: 2,
          }}
        />
      </FlexWidget>

      {/* Mini chart */}
      {chartSvg ? (
        <FlexWidget
          style={{
            width: "match_parent",
            height: 80,
            marginTop: 6,
            borderRadius: 8,
            backgroundColor: "#F8F9FA",
          }}
        >
          <SvgWidget svg={chartSvg} style={{ width: 280, height: 80 }} />
        </FlexWidget>
      ) : null}
    </FlexWidget>
  );
}

export function SpotBrooWidgetLoading() {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text="SpotBroo"
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#1a1a1a",
        }}
      />
      <TextWidget
        text="Loading prices..."
        style={{
          fontSize: 12,
          color: "#888888",
          marginTop: 8,
        }}
      />
    </FlexWidget>
  );
}
