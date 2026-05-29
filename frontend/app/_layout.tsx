import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import mobileAds from "react-native-google-mobile-ads";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { useOTAUpdate } from "@/src/hooks/useOTAUpdate";
import { useThemePreference } from "@/src/hooks/useThemePreference";

// Keep the native splash visible from cold start until icon fonts register.
// Required because @expo/vector-icons' componentDidMount fallback fires
// Font.loadAsync against a broken vendor path if any <Icon> mounts before
// the family is registered — which throws on Android Expo Go.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useIconFonts();
  useOTAUpdate();
  useThemePreference();

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // If the CDN is unreachable we fall through on error rather than wedging
  // the app — icons will tofu, but the app still boots.
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </SafeAreaProvider>
  );
}
