import { Image } from "expo-image";
import { View, ViewProps } from "react-native";

import { useTheme } from "@/context/theme";

interface Props extends ViewProps {
  uri: string | null | undefined;
}

export function AvatarImage({ uri, style, ...props }: Props) {
  const { accent } = useTheme();
  return (
    <View
      style={[
        {
          borderRadius: 9999,
          backgroundColor: accent,
          overflow: "hidden",
          aspectRatio: 1,
        },
        style,
      ]}
      {...props}
    >
      {uri && (
        <Image
          source={{ uri }}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="cover"
        />
      )}
    </View>
  );
}
