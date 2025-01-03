import { Stack, useRouter } from "expo-router";
import { StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsProvider } from "@/context/SetttingsContext";
import { DateProvider } from '@/context/DateContext';
import { PriceProvider } from "@/context/PriceContext";

export default function RootLayout() {

  const router = useRouter();

  const goToSettings = () => {
    router.push("/settings");
  };

  return (
    <SettingsProvider>
      <DateProvider>
        <PriceProvider>
          <StatusBar barStyle="dark-content" />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: 'SpotBroo', // Change the title here
                headerRight: () => (
                  <TouchableOpacity onPressIn={goToSettings}>
                    <Ionicons name="settings-outline" size={24} color="black" />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings', // Change the title here
              }}
            />
          </Stack>
        </PriceProvider>
      </DateProvider>
    </SettingsProvider>
  );
}