import { Pressable, PressableProps } from "react-native";

import { defaultIconProps, IconProps, Icons } from "@/components/icons";
import { useTheme } from "@/context/theme";

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Icons;
  iconProps?: IconProps;
}

export function IconButton({ icon, iconProps, ...props }: IconButtonProps) {
  const { mutedForeground, foreground } = useTheme();
  const { size, color, strokeWidth, filled }: IconProps = {
    ...defaultIconProps,
    ...iconProps,
  };
  const Icon = Icons[icon];

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <Icon
          size={size}
          color={pressed ? mutedForeground : color ? color : foreground}
          strokeWidth={strokeWidth}
          filled={filled}
        />
      )}
    </Pressable>
  );
}
