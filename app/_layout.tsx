// app/_layout.tsx

import { Stack } from "expo-router";
import { 
  useFonts, 
  PlayfairDisplay_700Bold 
} from "@expo-google-fonts/playfair-display";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import { DancingScript_400Regular } from "@expo-google-fonts/dancing-script";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_Bold: PlayfairDisplay_700Bold,
    Poppins_Regular: Poppins_400Regular,
    DancingScript_Regular: DancingScript_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
