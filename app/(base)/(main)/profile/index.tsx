import PostItem from "@/components/post-item";
import { useCurrentUser } from "@/context/user";

export default function ProfileIndexPage() {
  const { posts } = useCurrentUser();

  return (
    <>
      {posts.map((post, i) => (
        <PostItem key={i} post={post} />
      ))}
    </>
  );
}
