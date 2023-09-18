import { Image } from "expo-image";
import { View, ViewProps } from "react-native";

import { useTheme } from "@/context/theme";

interface Props extends ViewProps {
  uri: string;
  size: number;
}

export function AvatarImage({ size, uri, style, ...props }: Props) {
  const { accent } = useTheme();
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accent,
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
        }}
        contentFit="cover"
      />
    </View>
  );
}
