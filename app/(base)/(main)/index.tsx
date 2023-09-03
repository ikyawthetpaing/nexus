import { Pressable, StatusBar } from "react-native";

import { posts } from "@/constants/dummy-data";
import PostItem from "@/components/post-item";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { View } from "@/components/themed";
import { Icons } from "@/components/icons";
import { router } from "expo-router";
import { ViewWithHeader } from "@/components/view-with-header";

export default function HomePage() {
  const { background, mutedForeground, primary } = getThemedColors();
  const { padding } = getStyles();

  return (
    <View>
      <StatusBar backgroundColor={background} />
      <ViewWithHeader
        headerChildren={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: padding,
            }}
          >
            <View>
              <Icons.logo style={{ width: 64, flex: 1 }} />
            </View>
            <Pressable onPress={() => router.push("/notifications")}>
              {({ pressed }) => (
                <Icons.bell
                  size={24}
                  color={pressed ? primary : mutedForeground}
                />
              )}
            </Pressable>
          </View>
        }
      >
        {posts.map((post, i) => (
          <PostItem
            key={i}
            post={post}
            style={{ paddingHorizontal: padding }}
          />
        ))}
      </ViewWithHeader>
    </View>
  );
}
