import { useState } from "react";
import { useCurrentUser } from "@/context/user";
import { PostEditor } from "@/components/post-editor";
import { AddPostType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { posts as dmPosts, users } from "@/constants/dummy-data";

export default function PostReplyScreen() {
  const { postId } = useLocalSearchParams();
  const replyToPost = dmPosts.find(({ id }) => id === postId);
  const author = users.find(({ id }) => id === replyToPost?.authorId);

  const { user } = useCurrentUser();

  if (!user || !replyToPost || !author) {
    return null;
  }

  const [posts, setPosts] = useState<AddPostType[]>([
    {
      content: "",
      images: []
    }
  ]);

  return <PostEditor posts={posts} setPosts={setPosts} action="reply" replyToPosts={[replyToPost]} />;
}
