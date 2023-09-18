import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { useTheme } from "@/context/theme";

export function StatusBar() {
  const { background } = useTheme();
  return <ExpoStatusBar backgroundColor={background} />;
}
