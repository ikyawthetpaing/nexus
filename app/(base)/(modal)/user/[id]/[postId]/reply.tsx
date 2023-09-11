import { useState } from "react";
import { useCurrentUser } from "@/context/user";
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

export default function PostReplyScreen() {
  const { postId } = useLocalSearchParams();
  const { user } = useCurrentUser();

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

        const createPostData: CreatePost = {
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
