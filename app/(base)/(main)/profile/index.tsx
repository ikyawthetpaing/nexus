import PostItem from "@/components/post-item";
import { Text, View } from "@/components/themed";
import { useUserPostsSnapshot } from "@/hooks/snapshots";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";

export default function ProfileIndexScreen() {
  const { mutedForeground } = useTheme();
  const { user } = useCurrentUser();
  const { posts } = useUserPostsSnapshot(user.id);

  return (
    <View style={{ flex: 1 }}>
      {posts.length > 0 ? (
        posts.map((post, i) => <PostItem key={i} post={post} />)
      ) : (
        <Text
          style={{
            marginTop: 64,
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
