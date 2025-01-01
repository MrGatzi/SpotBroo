import { useData } from '@/hooks/useData';
import React, { createContext, useContext, ReactNode } from 'react';

interface DataContextProps {
  getDataForDay: (date: Date) => Promise<any>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { getDataForDay } = useData();
  return (
    <DataContext.Provider value={{ getDataForDay }}>
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