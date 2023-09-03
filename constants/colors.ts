import { useColorScheme } from "react-native";

type ColorValue = string;

export type Colors = {
  background: ColorValue;
  foreground: ColorValue;
  primary: ColorValue;
  primaryForeground: ColorValue;
  secondary: ColorValue;
  secondaryForeground: ColorValue;
  muted: ColorValue;
  mutedForeground: ColorValue;
  accent: ColorValue;
  accentForeground: ColorValue;
  destructive: ColorValue;
  destructiveForeground: ColorValue;
  border: ColorValue;
};

type ThemeColors = {
  light: Colors
  dark: Colors
}

export const themeColors: ThemeColors = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 3.9%)",
    primary: "hsl(0, 0%, 9%)",
    primaryForeground: "hsl(0, 0%, 98%)",
    secondary: "hsl(0, 0%, 96.1%)",
    secondaryForeground: "hsl(0, 0%, 9%)",
    muted: "hsl(0, 0%, 96.1%)",
    mutedForeground: "hsl(0, 0%, 45.1%)",
    accent: "hsl(0, 0%, 96.1%)",
    accentForeground: "hsl(0, 0%, 9%)",
    destructive: "hsl(0, 84.2%, 60.2%)",
    destructiveForeground: "hsl(0, 0%, 98%)",
    border: "hsl(0, 0%, 89.8%)"
  },
  dark: {
    background: "hsl(0, 0%, 3.9%)",
    foreground: "hsl(0, 0%, 98%)",
    primary: "hsl(0, 0%, 98%)",
    primaryForeground: "hsl(0, 0%, 9%)",
    secondary: "hsl(0, 0%, 14.9%)",
    secondaryForeground: "hsl(0, 0%, 98%)",
    muted: "hsl(0, 0%, 14.9%)",
    mutedForeground: "hsl(0, 0%, 63.9%)",
    accent: "hsl(0, 0%, 14.9%)",
    accentForeground: "hsl(0, 0%, 98%)",
    destructive: "hsl(0, 62.8%, 30.6%)",
    destructiveForeground: "hsl(0, 0%, 98%)",
    border: "hsl(0, 0%, 14.9%)"
  }
};

export function getThemedColors(): Colors {
  const colorScheme = useColorScheme();
  const selectedTheme = themeColors[colorScheme ?? "light"];
  return selectedTheme;
}