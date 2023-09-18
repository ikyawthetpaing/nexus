import { useState } from "react";
import { AddPost } from "@/types";
import { router } from "expo-router";
import { View } from "react-native";

import { useAlert } from "@/components/ui/alert";
import { PostEditor } from "@/components/post-editor";
import { useUploader } from "@/context/uploader";
import { isPostsHasEmptyContent } from "@/lib/utils";

export default function AddPostScreen() {
  const { setUpload } = useUploader();
  const { Alert, setAlert } = useAlert();

  const [posts, setPosts] = useState<AddPost[]>([{ content: "", images: [] }]);

  function onSubmit() {
    setUpload({ posts });
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  }

  function onCancel() {
    if (!isPostsHasEmptyContent(posts)) {
      setAlert({
        title: "Unsaved changes",
        description:
          "You have unsaved changes. Are you sure you want to cancel?",
        button: [
          { text: "Yes", action: () => router.back() },
          { text: "No", action: () => setAlert(null) },
        ],
      });
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/");
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <PostEditor
        posts={posts}
        setPosts={setPosts}
        action="post"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <Alert />
    </View>
  );
}
