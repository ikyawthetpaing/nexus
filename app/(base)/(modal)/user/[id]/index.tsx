import { useLocalSearchParams } from "expo-router";

import PostItem from "@/components/post-item";
import { Text, View } from "@/components/themed";
import { useUserPostsSnapshot } from "@/hooks/snapshots";
import { useTheme } from "@/context/theme";

export default function UserProfileHomeScreen() {
  const { mutedForeground } = useTheme();

  const { id } = useLocalSearchParams();
  const userId = typeof id === "string" ? id : "";

  const { posts } = useUserPostsSnapshot(userId);

  return (
    <View>
      {posts.length > 0 ? (
        posts.map((post, i) => <PostItem key={i} post={post} />)
      ) : (
        <Text
          style={{
            marginTop: 32,
            textAlign: "center",
            fontSize: 16,
            color: mutedForeground,
          }}
        >
          No posts yet
        </Text>
      )}
    </View>
  );
}
