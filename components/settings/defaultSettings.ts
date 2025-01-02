import { HeaderSettings } from './settings.types';

export const defaultSettings: HeaderSettings[] = [
  {
    header: 'General',
    settings: [
      {
        label: 'Unit',
        value: 'MWh',
        options: ['MWh', 'Wh'],
      },
      {
        label: 'Country',
        value: 'United States',
        options: ['United States', 'Canada', 'United Kingdom', 'AT', 'DE'],
      },
      {
        label: 'Currency',
        value: 'USD',
        options: ['USD', 'CAD', 'GBP', 'EUR'],
      },
      {
        label: 'Date format',
        value: 'MM/DD/YYYY',
        options: ['MM/DD/YYYY', 'DD/MM/YYYY'],
      },
      {
        label: 'Time format',
        value: '12-hour',
        options: ['12-hour', '24-hour'],
      },
    ],
  },
  {
    header: 'Advanced',
    settings: [
      {
        label: 'Theme',
        value: 'Light',
        options: ['Light', 'Dark'],
      },
    ],
  },
];