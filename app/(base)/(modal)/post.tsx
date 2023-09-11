import { useState } from "react";
import { PostEditor } from "@/components/post-editor";
import { AddPost } from "@/types";
import { router } from "expo-router";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogFooterButton,
  DialogTitle,
} from "@/components/ui/dialog";
import { View } from "react-native";
import { isPostsHasEmptyContent } from "@/lib/utils";
import { useCurrentUser } from "@/context/current-user";
import { useUploader } from "@/context/uploader";

export default function PostScreen() {
  const { user } = useCurrentUser();
  const { setUpload } = useUploader();
  if (!user) {
    return null;
  }

  const [dialogVisiable, setDailogVisiable] = useState(false);
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
      <Dialog visible={dialogVisiable}>
        <DialogTitle>Unsaved changes</DialogTitle>
        <DialogDescription>
          You have unsaved changes. Are you sure you want to cancel?
        </DialogDescription>
        <DialogFooter>
          <DialogFooterButton
            textStyle={{ fontWeight: "500", color: "#60a5fa" }}
            onPress={() => router.back()}
          >
            Yes
          </DialogFooterButton>
          <DialogFooterButton onPress={() => setDailogVisiable(false)}>
            No
          </DialogFooterButton>
        </DialogFooter>
      </Dialog>
    </View>
  );
}
