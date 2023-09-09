import { Animated, Platform, StatusBar, ViewProps } from "react-native";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";

interface HeaderProps extends ViewProps {
  scrollY?: Animated.Value;
}

export const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

export const HEADER_HEIGHT =
  Platform.OS === "ios" ? 105 : 60 + STATUSBAR_HEIGHT || 0;

export function Header({
  scrollY = new Animated.Value(0),
  children,
  ...props
}: HeaderProps) {
  const { border, background } = getThemedColors();
  const { borderWidthSmall: borderWidth } = getStyles();

  const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const headerY = diffClampScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT + STATUSBAR_HEIGHT + 1], // +1 for border bottom visible
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: HEADER_HEIGHT,
          zIndex: 20,
          elevation: 1000,
          borderBottomWidth: borderWidth,
          borderColor: border,
          backgroundColor: background,
          paddingTop: STATUSBAR_HEIGHT,
          overflow: "hidden",
          transform: [{ translateY: headerY }],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}