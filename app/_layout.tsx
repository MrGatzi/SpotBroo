import { Stack, useRouter, useSegments } from "expo-router";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsProvider } from "@/contexts/SetttingsContext";
import { DateProvider } from '@/contexts/DateContext';
import { DataProvider } from "@/contexts/DataContext";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const goToSettings = () => {
    router.push('/settings');
  };

  return (
    <SettingsProvider>
      <DateProvider>
        <DataProvider>
        <Stack
          screenOptions={{
            headerRight: () => (
              segments[0] === 'home' ? (
                <TouchableOpacity onPressIn={goToSettings}>
                  <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
              ) : null
            ),
          }}
        />
        </DataProvider>
      </DateProvider>
    </SettingsProvider>
  );
}