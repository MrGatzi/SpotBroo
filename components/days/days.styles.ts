import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    daysListContainer: {
        paddingVertical: 10,
    },
    dayContainer: {
        width: 80, // Fixed width for each item
        height: 80, // Fixed height for each item to make it square
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#fff', // White background color
        borderRadius: 10, // Rounded corners
        shadowColor: '#000', // Shadow for modern look
        shadowOffset: { width: 0, height: 2 }, // Adjusted to create shadow on all sides
        shadowOpacity: 0.1,
        shadowRadius: 4, // Increased shadow radius for a more balanced shadow
        elevation: 3, // Elevation for Android shadow
    },
    highlight: {
        backgroundColor: '#4caf50', // More vibrant highlight color for the current date
    },
    highlightText: {
        color: '#fff', // White text color for highlighted date
    },
    dayOfWeek: {
        fontSize: 12,
        color: '#888', // Lighter color for the day of the week
    },
    dayOfMonth: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333', // Darker color for better contrast
    },
});