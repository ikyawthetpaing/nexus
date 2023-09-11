import React, { createContext, useContext, useState } from "react";
import LoadingScreen from "@/components/loading";
import { AddPost, CreatePost, UploadedImage } from "@/types";
import { uploadFileToFirebase } from "@/firebase/storage";
import { StoragePath } from "@/firebase/config";
import { createPost } from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
import { useCurrentUser } from "./current-user";

interface UploaderContextType {
  loading: boolean;
  upload: (posts: AddPost[], replyToId?: string | null) => Promise<void>;
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
  const { setRefresh } = useCurrentUser();
  const [loading, setLoading] = useState(false);

  async function upload(posts: AddPost[], replyToId?: string | null) {
    setLoading(true);
    try {
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
          replyToId: replyToId || null,
          content: post.content,
          images: uploadedImages,
        };

        const res = await createPost(createPostData);
        replyToId = res.id;
      }
    } catch (error) {
      console.error("Error during upload:", error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
      setRefresh(true);
    }
  }

  const uploaderContext: UploaderContextType = {
    loading,
    upload,
  };

  return (
    <UploaderContext.Provider value={uploaderContext}>
      {loading ? <LoadingScreen /> : children}
    </UploaderContext.Provider>
  );
}
