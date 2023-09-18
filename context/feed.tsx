import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Post } from "@/types";

import { usePostsFeedSnapshot } from "@/hooks/snapshots";

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
  const [, setRefresh] = useState(true);

  const { posts, loading } = usePostsFeedSnapshot();

  const feedContext: FeedContextType = {
    posts,
    loading,
    setRefresh,
  };

  return (
    <FeedContext.Provider value={feedContext}>{children}</FeedContext.Provider>
  );
}
