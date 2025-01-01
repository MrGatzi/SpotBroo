import axios from 'axios';
import { format } from 'date-fns';
import { PublicationMarketDocument } from './types';
import { XMLParser } from 'fast-xml-parser';

const API_KEY = "0f429ce3-56d4-4bf5-a1d1-c9273eb87b75"; // Use process.env to get the API key

export const useData = () => {
    const getDataForDay = async (date: Date) => {
        if (!date) {
            throw new Error('Selected date is null');
        }

        const periodStart = format(date, 'yyyyMMddHHmm');
        const periodEnd = format(new Date(date.getTime() + 24 * 60 * 60 * 1000), 'yyyyMMddHHmm'); // Add 24 hours to the start date
        console.log('Fetching data for period:', periodStart, periodEnd);
        const url = `https://web-api.tp.entsoe.eu/api?documentType=A44&periodStart=${periodStart}&periodEnd=${periodEnd}&out_Domain=10YAT-APG------L&in_Domain=10YAT-APG------L&securityToken=${API_KEY}`;

        try {
            const response = await axios.get(url);

            const parser = new XMLParser({ ignoreAttributes: false });
            let result = parser.parse(response.data);
            const publicationMarketDocument = result.Publication_MarketDocument as PublicationMarketDocument;
            // Find the TimeSeries with mRID 2
            const timeSeries = publicationMarketDocument.TimeSeries.find(ts => ts.mRID === 2);
            if (!timeSeries) {
                throw new Error('TimeSeries with mRID 2 not found');
            }
            return timeSeries.Period.Point;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    return {
        getDataForDay,
    };

}