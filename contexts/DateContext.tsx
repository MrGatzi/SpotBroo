import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDateContext = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDateContext must be used within a DateProvider');
    }
    return context;
};