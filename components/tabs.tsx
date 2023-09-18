import { TabBar } from "@/types";
import { router, usePathname } from "expo-router";
import { ViewProps } from "react-native";

import { getStyles } from "@/constants/style";
import { useTheme } from "@/context/theme";

import { View } from "./themed";
import { IconButton } from "./ui/icon-button";

export const TAB_HEIGHT = 55;

interface Props extends ViewProps {
  tabItems: TabBar[];
}

export function Tabs({ tabItems, style, ...props }: Props) {
  const { border, mutedForeground, foreground } = useTheme();
  const { borderWidthSmall } = getStyles();
  const pathname = usePathname();

  return (
    <View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_HEIGHT,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          borderTopWidth: borderWidthSmall,
          borderColor: border,
          zIndex: 9999,
          elevation: 9999,
        },
        style,
      ]}
      {...props}
    >
      {tabItems.map((item, index) => {
        const isActive = pathname === item.slug;
        return (
          <IconButton
            key={index}
            icon={item.icon}
            iconProps={{
              color: isActive ? foreground : mutedForeground,
              filled: isActive,
            }}
            onPress={() => router.push(item.slug)}
          />
        );
      })}
    </View>
  );
}
