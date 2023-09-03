import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as DefaultThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const colorScheme = useColorScheme();
  return (
    <DefaultThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {children}
    </DefaultThemeProvider>
  );
}
