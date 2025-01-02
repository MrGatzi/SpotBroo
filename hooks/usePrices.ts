import axios from 'axios';
import { format } from 'date-fns';
import { ChartPoint, PublicationMarketDocument } from './types';
import { XMLParser } from 'fast-xml-parser';
import { useSettingsContext } from '@/context/SetttingsContext';

const API_KEY = "0f429ce3-56d4-4bf5-a1d1-c9273eb87b75"; // Use process.env to get the API key

export const usePrices = () => {
    const { getSettingValue } = useSettingsContext();

    const getPricesForDay = async (date: Date): Promise<ChartPoint[]> => {
        const periodStart = format(date, 'yyyyMMddHHmm');
        const periodEnd = format(new Date(date.getTime() + 24 * 60 * 60 * 1000), 'yyyyMMddHHmm');
        const url = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YAT-APG------L&in_Domain=10YAT-APG------L&securityToken=${API_KEY}`;
        try {
            const response = await axios.get(url);
            let result = new XMLParser({ ignoreAttributes: true }).parse(response.data);
            const publicationMarketDocument = result.Publication_MarketDocument as PublicationMarketDocument;
            // Find the TimeSeries with mRID 2 --> cause thats what we want.
            const timeSeries = publicationMarketDocument.TimeSeries.find(ts => ts.mRID === 2);
            if (!timeSeries) {
                throw new Error('TimeSeries with mRID 2 not found');
            }
            const transformedData = timeSeries.Period.Point.map(point => ({
                time: point.position - 1,
                //@ts-ignore
                price: point['price.amount'] as number
            }));
            return adjustPrices(transformedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const adjustPrices = (data: ChartPoint[]): ChartPoint[] => {
        const unit = getSettingValue('Unit');
        return data.map(point => ({
          ...point,
          price: unit === 'Wh' ? point.price / 1000 : point.price
        }));
      };

    const getPricesForCurrentHour = async () => {
        const now = new Date();
        const currentHour = now.getHours();
        const prices = await getPricesForDay(new Date(now.setHours(0, 0, 0, 0)));
        const currentHourPrice = prices.find(point => point.time === currentHour);
        return currentHourPrice ? currentHourPrice.price : null;
    }

    return {
        getPricesForDay,
        getPricesForCurrentHour
    };

}