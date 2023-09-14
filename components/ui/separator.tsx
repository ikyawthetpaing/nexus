import { View, ViewProps } from "react-native";

import { useThemedColors } from "@/constants/colors";

interface Props extends ViewProps {
  size?: number;
  orientation?: "horizontal" | "vertical";
}
export function Separator({
  size = 1,
  orientation = "horizontal",
  style,
  ...props
}: Props) {
  const { muted } = useThemedColors();
  return (
    <View
      style={[
        {
          backgroundColor: muted,
          borderRadius: size / 2,
        },
        style,
        orientation === "horizontal" && { height: size, width: "100%" },
        orientation === "vertical" && { width: size, height: "100%" },
      ]}
      {...props}
    />
  );
}
