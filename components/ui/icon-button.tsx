import { Pressable, PressableProps } from "react-native";

import { defaultIconProps, IconProps, Icons } from "@/components/icons";
import { useThemedColors } from "@/constants/colors";

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Icons;
  iconProps?: IconProps;
}

export function IconButton({ icon, iconProps, ...props }: IconButtonProps) {
  const { mutedForeground, foreground } = useThemedColors();
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
          color={color ? color : pressed ? mutedForeground : foreground}
          strokeWidth={strokeWidth}
          filled={filled}
        />
      )}
    </Pressable>
  );
}
