import { LocalImage } from "@/types";
import { Image } from "expo-image";
import { Pressable, ScrollView, useColorScheme, ViewProps } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { getStyles } from "@/constants/style";

interface Props extends ViewProps {
  images: LocalImage[];
  width: number;
  onClickImage?: (i: number) => void;
  onRemoveImage?: (i: number) => void;
}

export function ImagesList({
  images,
  width,
  onClickImage,
  onRemoveImage,
  style,
  ...props
}: Props) {
  const { padding, borderRadius } = getStyles();
  const MAX_HEIGHT = 600;

  const colorScheme = useColorScheme();

  if (!images.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        {
          gap: padding,
          maxHeight:
            images[0].height < MAX_HEIGHT ? images[0].height : MAX_HEIGHT,
        },
        style,
      ]}
      {...props}
    >
      {images.map((value, index) => (
        <Pressable
          key={index}
          onPress={() => (onClickImage ? onClickImage(index) : {})}
          style={[
            {
              aspectRatio: value.width / value.height,
              borderRadius: borderRadius,
              overflow: "hidden",
              position: "relative",
            },
            index === 0 && {
              width:
                width -
                (index === 0 && images.length > 1 ? padding * 2 : padding),
            },
          ]}
        >
          {({ pressed }) => (
            <>
              <Image
                source={{ uri: value.uri }}
                style={[
                  {
                    flex: 1,
                  },
                  pressed && { opacity: 0.75 },
                ]}
              />
              {onRemoveImage && (
                <IconButton
                  size={18}
                  icon="close"
                  onPress={() => onRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: padding,
                    right: padding,
                    padding: 6,
                    backgroundColor: colorScheme
                      ? "rgba(255, 255, 255, 0.5)"
                      : "rgba(0, 0, 0, 0.5)",
                    borderRadius: 9999,
                  }}
                />
              )}
            </>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}
