import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AddPost, Post, UploadedImage } from "@/types";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";

import { STORAGE_PATH } from "@/firebase/config";
import { handleFirebaseError } from "@/firebase/error-handler";
import { createPost } from "@/firebase/firestore";
import { uploadFileToFirebase } from "@/firebase/storage";
import { getUniqueString } from "@/lib/utils";

import { useCurrentUser } from "./current-user";

type UploadType = {
  posts: AddPost[];
  replyToId?: string;
};

interface UploaderContextType {
  loading: boolean;
  setUpload: Dispatch<SetStateAction<UploadType | null>>;
}

const UploaderContext = createContext<UploaderContextType | undefined>(
  undefined
);

export function useUploader() {
  const context = useContext(UploaderContext);
  if (!context) {
    throw new Error(
      "useUploader must be used within an UploaderContextProvider"
    );
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function UploaderContextProvider({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState<UploadType | null>(null);
  const { user } = useCurrentUser();

  async function performUpload(posts: AddPost[], replyToId?: string) {
    setLoading(true);
    try {
      for (const post of posts) {
        const uploadedImages: UploadedImage[] = await Promise.all(
          post.images.map(async (image) => {
            const res = await uploadFileToFirebase({
              localFilePath: image.uri,
              storagePath: STORAGE_PATH.POSTS,
            });
            return { ...res, width: image.width, height: image.height };
          })
        );

        const postData: Post = {
          replyToId: replyToId || null,
          content: post.content,
          images: uploadedImages,
          authorId: user.id,
          createdAt: Timestamp.now(),
          id: getUniqueString(),
        };

        const res = await createPost(postData);
        replyToId = res.id;
      }
    } catch (error) {
      console.error("Error during upload:", error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
      setUpload(null);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/");
      }
    }
  }

  useEffect(() => {
    if (upload) {
      performUpload(upload.posts, upload.replyToId);
    }
  }, [upload]);

  const uploaderContext: UploaderContextType = {
    loading,
    setUpload,
  };

  return (
    <UploaderContext.Provider value={uploaderContext}>
      {children}
    </UploaderContext.Provider>
  );
}
