import { posts } from "@/constants/dummy-data";
import PostItem from "@/components/post-item";
import { getStyles } from "@/constants/style";

export default function ProfileIndexPage() {
  const { padding } = getStyles();

  return (
    <>
      {posts.map((post, i) => (
        <PostItem key={i} post={post} style={{ paddingHorizontal: padding }} />
      ))}
    </>
  );
}
