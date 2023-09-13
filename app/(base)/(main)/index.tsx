import { router } from "expo-router";
import { Dimensions, Pressable, RefreshControl, StatusBar } from "react-native";

import { HEADER_HEIGHT } from "@/components/header";
import { Icons } from "@/components/icons";
import PostItem from "@/components/post-item";
import { View } from "@/components/themed";
import { ScrollViewWithHeader } from "@/components/view-with-header";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { useFeed } from "@/context/feed";

export default function HomePage() {
  const { background, mutedForeground, primary } = getThemedColors();
  const { padding } = getStyles();

  const { posts, loading, setRefresh } = useFeed();

  return (
    <View>
      <StatusBar backgroundColor={background} />
      <ScrollViewWithHeader
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
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(true)}
            progressViewOffset={HEADER_HEIGHT}
          />
        }
        contentContainerStyle={{
          minHeight: Dimensions.get("screen").height + HEADER_HEIGHT,
        }}
      >
        {posts.map((post, i) => (
          <PostItem key={i} post={post} />
        ))}
      </ScrollViewWithHeader>
    </View>
  );
}
