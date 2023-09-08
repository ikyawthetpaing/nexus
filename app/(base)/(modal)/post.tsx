import { useState } from "react";
import { useCurrentUser } from "@/context/user";
import { PostEditor } from "@/components/post-editor";
import { AddPostType } from "@/types";

export default function PostScreen() {
  const { user } = useCurrentUser();
  if (!user) {
    return null;
  }

  const [posts, setPosts] = useState<AddPostType[]>([
    { content: "", images: [] },
  ]);

  return (
    <PostEditor posts={posts} setPosts={setPosts} action="post" />
  );
}