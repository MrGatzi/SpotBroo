import { Stack, useRouter, useSegments } from "expo-router";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const goToSettings = () => {
    console.log("Go to settings");
    router.push('/settings');
  };

  return (
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
  );
}