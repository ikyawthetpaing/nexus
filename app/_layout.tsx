import { useEffect } from "react";
import { Toasts } from "@backpackapp-io/react-native-toast";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import { StatusBar } from "@/components/status-bar";
import { AlertContextProvider } from "@/context/alert";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(base)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AlertContextProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false, animation: "none" }} />
          <StatusBar />
          <Toasts />
        </AuthProvider>
      </AlertContextProvider>
    </ThemeProvider>
  );
}
