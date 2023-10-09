import PostItem from "@/components/post-item";
import { Text, View } from "@/components/themed";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";

export default function ProfileIndexScreen() {
  const { mutedForeground } = useTheme();
  const { posts } = useCurrentUser();

  return (
    <View>
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
