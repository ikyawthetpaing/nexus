import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import LoadingScreen from "@/components/loading";
import { AddPost, CreatePost, UploadedImage } from "@/types";
import { uploadFileToFirebase } from "@/firebase/storage";
import { StoragePath } from "@/firebase/config";
import { createPost } from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
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
  const { setRefresh } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState<UploadType | null>(null);

  async function performUpload(posts: AddPost[], replyToId?: string) {
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
      setUpload(null);
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
      {loading ? <LoadingScreen /> : children}
    </UploaderContext.Provider>
  );
}