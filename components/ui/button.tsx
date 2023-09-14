import { Pressable, PressableProps, Text, View } from "react-native";

import { useThemedColors } from "@/constants/colors";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "xs";
}

export function Button({
  children,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const {
    foreground,
    background,
    primary,
    primaryForeground,
    muted,
    mutedForeground,
    border,
  } = useThemedColors();

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View
          style={[
            {
              backgroundColor: background,
              alignItems: "center",
              padding: size === "default" ? 12 : size === "sm" ? 4 : 2,
              paddingHorizontal: 16,
              borderRadius: 100,
            },
            variant === "default" && { backgroundColor: primary },
            variant === "outline" && { borderWidth: 1, borderColor: border },
            variant === "ghost" && { padding: 0 },

            pressed && { transform: [{ scale: 0.98 }] },

            props.disabled && { backgroundColor: muted },
          ]}
        >
          <Text
            style={[
              {
                fontSize: size === "default" ? 16 : 14,
                fontWeight: "500",
                color: foreground,
              },
              variant === "default" && { color: primaryForeground },

              props.disabled && { color: mutedForeground },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
