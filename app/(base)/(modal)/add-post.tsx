import { useState } from "react";
import { AddPost } from "@/types";
import { router } from "expo-router";
import { View } from "react-native";

import {
  Alert,
  AlertDescription,
  AlertFooter,
  AlertFooterButton,
  AlertTitle,
} from "@/components/ui/dialog";
import { PostEditor } from "@/components/post-editor";
import { useUploader } from "@/context/uploader";
import { isPostsHasEmptyContent } from "@/lib/utils";

export default function AddPostScreen() {
  const { setUpload } = useUploader();

  const [dialogVisiable, setDailogVisiable] = useState(false);
  const [posts, setPosts] = useState<AddPost[]>([{ content: "", images: [] }]);

  function onSubmit() {
    setUpload({ posts });
    router.replace("/");
  }

  function onCancel() {
    if (!isPostsHasEmptyContent(posts)) {
      setDailogVisiable(true);
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
      <Alert visible={dialogVisiable}>
        <AlertTitle>Unsaved changes</AlertTitle>
        <AlertDescription>
          You have unsaved changes. Are you sure you want to cancel?
        </AlertDescription>
        <AlertFooter>
          <AlertFooterButton
            textStyle={{ fontWeight: "500", color: "#60a5fa" }}
            onPress={() => router.back()}
          >
            Yes
          </AlertFooterButton>
          <AlertFooterButton onPress={() => setDailogVisiable(false)}>
            No
          </AlertFooterButton>
        </AlertFooter>
      </Alert>
    </View>
  );
}
