import React, { createContext, useContext, useMemo } from "react";
import { Post, User } from "@/types";

import { useUserPostsSnapshot, useUserSnapshot } from "@/hooks/snapshots";
import { getAuthUser } from "@/firebase/auth";

interface CurrentUserContextType {
  user: User | null;
  posts: Post[];
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      "useCurrentUser must be used within an CurrentUserContextProvider"
    );
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function CurrentUserContextProvider({ children }: Props) {
  const authUserId = useMemo(() => getAuthUser()?.uid || "", []);

  const { user } = useUserSnapshot(authUserId);
  const { posts } = useUserPostsSnapshot(authUserId);

  const userContext: CurrentUserContextType = {
    user,
    posts,
  };

  return (
    <CurrentUserContext.Provider value={userContext}>
      {children}
    </CurrentUserContext.Provider>
  );
}
