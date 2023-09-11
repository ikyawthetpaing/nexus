import { useState } from "react";
import { PostEditor } from "@/components/post-editor";
import { AddPostType, CreatePost, UploadedImage } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { uploadFileToFirebase } from "@/firebase/storage";
import { StoragePath } from "@/firebase/config";
import { createPost } from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
import { isPostsHasEmptyContent } from "@/lib/utils";
import { View } from "react-native";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogFooterButton,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploader } from "@/context/uploader";
import { useCurrentUser } from "@/context/current-user";

export default function PostReplyScreen() {
  const { postId } = useLocalSearchParams();
  const { user } = useCurrentUser();
  const {setUploadPosts} = useUploader();

  if (!user) {
    return null;
  }

  const [dialogVisiable, setDailogVisiable] = useState(false);
  const [posts, setPosts] = useState<AddPostType[]>([
    {
      content: "",
      images: [],
    },
  ]);

  function onSubmit() {
    setUploadPosts(posts);
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
      router.back();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <PostEditor
        posts={posts}
        setPosts={setPosts}
        action="reply"
        replyToPostId={typeof postId === "string" ? postId : undefined}
        onCancel={onCancel}
        onSubmit={onSubmit}
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
