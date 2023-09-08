import { getThemedColors } from "@/constants/colors";
import { View, ViewProps } from "react-native";

interface Props extends ViewProps {
  size?: number;
  orientation?: "horizontal" | "vertical";
}
export function Separator({ size = 1, orientation = "horizontal", style, ...props }: Props) {
  const { muted } = getThemedColors();
  return (
    <View
      style={[
        {
          backgroundColor: muted,
          borderRadius: size/2
        },
        style,
        orientation === "horizontal" && { height: size, width: "100%" },
        orientation === "vertical" && { width: size, height: "100%" },
      ]}
      {...props}
    />
  );
}
