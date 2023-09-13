import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Post } from "@/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { DBCollections, FIREBASE_DB } from "@/firebase/config";
import { postConverter } from "@/firebase/database";

interface FeedContextType {
  posts: Post[];
  loading: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within an FeedContextProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function FeedContextProvider({ children }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true); // init true for first time

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(FIREBASE_DB, DBCollections.Posts),
      where("replyToId", "==", null)
    ).withConverter(postConverter);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        newPosts.push(doc.data());
      });
      setPosts(newPosts);
      setLoading(false);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, [refresh]);

  const feedContext: FeedContextType = {
    posts,
    loading,
    setRefresh,
  };

  return (
    <FeedContext.Provider value={feedContext}>{children}</FeedContext.Provider>
  );
}
