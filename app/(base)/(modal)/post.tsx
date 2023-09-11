import { useState } from "react";
import { PostEditor } from "@/components/post-editor";
import { AddPostType, UploadedImage } from "@/types";
import { handleFirebaseError } from "@/firebase/error-handler";
import { uploadFileToFirebase } from "@/firebase/storage";
import { StoragePath } from "@/firebase/config";
import { createPost } from "@/firebase/database";
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

export default function PostScreen() {
  const { user } = useCurrentUser();
  if (!user) {
    return null;
  }

  const [dialogVisiable, setDailogVisiable] = useState(false);
  const [posts, setPosts] = useState<AddPostType[]>([
    { content: "", images: [] },
  ]);

  async function onSubmit() {
    try {
      let previousPostId: string | null = null;

      for (const post of posts) {
        const uploadedImages: UploadedImage[] = await Promise.all(
          post.images.map(async (image) => {
            const res = await uploadFileToFirebase({
              localFilePath: image.uri,
              storagePath: StoragePath.Posts,
            });
            return { ...res, width: image.width, height: image.height };
          })
        );

        const createPostData = {
          replyToId: previousPostId,
          content: post.content,
          images: uploadedImages,
        };

        const res = await createPost(createPostData);
        previousPostId = res.id;
      }

      router.replace("/");
    } catch (error) {
      handleFirebaseError(error);
    }
    console.log(posts);
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
