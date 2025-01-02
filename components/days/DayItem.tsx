import React from 'react';
import { useDateContext } from '@/context/DateContext';
import { Text, TouchableOpacity } from 'react-native';
import { DayItemProps } from './days.types';
import { styles } from './days.styles';

export const DayItem = (props: DayItemProps) => {
    const { selectedDate, setSelectedDate } = useDateContext();

    const { date } = props;
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfMonth = date.getDate();
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    const isToday = new Date().toDateString() === date.toDateString();

    return (
        <TouchableOpacity onPress={() => setSelectedDate(date)} style={[
            styles.dayContainer,
            isSelected && styles.highlight,
            isToday && styles.todayBorder
        ]}>
            <Text style={[styles.dayOfMonth, isSelected && styles.highlightText]}>{dayOfMonth}</Text>
            <Text style={[styles.dayOfWeek, isSelected && styles.highlightText]}>{dayOfWeek}</Text>
        </TouchableOpacity>
    );
};