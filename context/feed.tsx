import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Post } from "@/types";

import { getAllPosts } from "@/firebase/database";

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
  const [refresh, setRefresh] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const feedPosts = await getAllPosts();
      setPosts(feedPosts);
    };
    if (refresh) {
      setLoading(true);
      console.log("fetch posts data");
      fetchData();
      setRefresh(false);
      setLoading(false);
    }
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
