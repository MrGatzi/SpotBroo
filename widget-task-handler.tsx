import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import {
  SpotBrooWidget,
  SpotBrooWidgetLoading,
} from "./widgets/SpotBrooWidget";
import { getSettingValueAsync } from "@/hooks/useSettings";
import { ChartPoint } from "@/hooks/types";
import axios from "axios";
import { format } from "date-fns";
import { XMLParser } from "fast-xml-parser";

const API_KEY = "0f429ce3-56d4-4bf5-a1d1-c9273eb87b75";

async function fetchDayPrices(unit: string): Promise<ChartPoint[]> {
  const now = new Date();
  const date = new Date(now.setHours(0, 0, 0, 0));
  const periodStart = format(date, "yyyyMMddHHmm");
  const periodEnd = format(
    new Date(date.getTime() + 24 * 60 * 60 * 1000),
    "yyyyMMddHHmm"
  );
  const url = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YAT-APG------L&in_Domain=10YAT-APG------L&securityToken=${API_KEY}`;

  const response = await axios.get(url);
  const result = new XMLParser({ ignoreAttributes: true }).parse(response.data);
  const timeSeries = result.Publication_MarketDocument?.TimeSeries?.find(
    (ts: any) => ts.mRID === 2
  );

  if (!timeSeries) return [];

  const rawData: ChartPoint[] = timeSeries.Period.Point.map((point: any) => ({
    time: point.position - 1,
    price: point["price.amount"] as number,
  }));

  return rawData.map((point) => ({
    ...point,
    price: unit === "Wh" ? point.price / 1000 : point.price,
  }));
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED":
      try {
        const unit = (await getSettingValueAsync("Unit")) ?? "MWh";
        const prices = await fetchDayPrices(unit);
        const currentHour = new Date().getHours();
        const currentEntry = prices.find((p) => p.time === currentHour);
        const currentPrice = currentEntry
          ? currentEntry.price.toFixed(2)
          : "--";

        props.renderWidget(
          <SpotBrooWidget
            currentPrice={currentPrice}
            currentHour={currentHour}
            unit={unit}
            prices={prices}
          />
        );
      } catch (_error) {
        props.renderWidget(<SpotBrooWidgetLoading />);
      }
      break;

    case "WIDGET_DELETED":
    case "WIDGET_CLICK":
    default:
      break;
  }
}
