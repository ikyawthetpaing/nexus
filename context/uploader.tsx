import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import LoadingScreen from "@/components/loading";
import { AddPostType, CreatePost, Post, UploadedImage } from "@/types";
import { uploadFileToFirebase } from "@/firebase/storage";
import { StoragePath } from "@/firebase/config";
import { createPost } from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
import { useCurrentUser } from "./current-user";

interface UploaderContextType {
  loading: boolean;
  setUploadPosts: Dispatch<SetStateAction<AddPostType[]>>;
}

const UploaderContext = createContext<UploaderContextType>({
  loading: false,
  setUploadPosts: () => {},
});

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
  const [uploadPosts, setUploadPosts] = useState<AddPostType[]>([]);

  async function upload(posts: AddPostType[]) {
    setLoading(true);
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
    } catch (error) {
      console.error("Error during upload:", error);
      handleFirebaseError(error);
    } finally {
      setUploadPosts([]);
      setLoading(false);
      setRefresh(true);
    }
  }

  useEffect(() => {
    if (uploadPosts.length > 0) {
      upload(uploadPosts);
    }
  }, [uploadPosts]);

  const uploaderContext: UploaderContextType = {
    loading,
    setUploadPosts,
  };

  return (
    <UploaderContext.Provider value={uploaderContext}>
      {loading ? <LoadingScreen /> : children}
    </UploaderContext.Provider>
  );
}
