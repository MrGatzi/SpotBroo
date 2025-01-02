import { usePrices } from '@/hooks/usePrices';
import React, { createContext, useContext, ReactNode } from 'react';

interface DataContextProps {
  getPricesForDay: (date: Date) => Promise<any>;
  getPricesForCurrentHour: () => Promise<any>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const { getPricesForDay, getPricesForCurrentHour } = usePrices();
  return (
    <DataContext.Provider value={{ getPricesForDay, getPricesForCurrentHour }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};