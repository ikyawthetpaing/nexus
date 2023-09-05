import { Pressable, PressableProps } from "react-native";
import { Icons } from "@/components/icons";
import { getThemedColors } from "@/constants/colors";

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Icons;
  size?: number;
}

export function IconButton({ icon, size = 28, ...props }: IconButtonProps) {
  const { mutedForeground, foreground } = getThemedColors();
  const Icon = Icons[icon];

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <Icon size={size} color={pressed ? mutedForeground : foreground} />
      )}
    </Pressable>
  );
}
