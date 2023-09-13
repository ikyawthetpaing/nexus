import React, { createContext, useContext, useEffect, useState } from "react";
import { Post, User } from "@/types";
import {
  and,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { DBCollections, FIREBASE_AUTH, FIREBASE_DB } from "@/firebase/config";
import { postConverter, userConverter } from "@/firebase/database";

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
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const authUser = FIREBASE_AUTH.currentUser;

    if (authUser) {
      const userUnsubscribe = onSnapshot(
        doc(FIREBASE_DB, DBCollections.Users, authUser.uid).withConverter(
          userConverter
        ),
        (doc) => {
          if (doc.exists()) {
            setUser(doc.data());
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        userUnsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (user) {
      const postsQuery = query(
        collection(FIREBASE_DB, DBCollections.Posts),
        and(where("authorId", "==", user.id), where("replyToId", "==", null))
      ).withConverter(postConverter);
      const postsUnsubscribe = onSnapshot(
        postsQuery,
        (querySnapshot) => {
          const _posts: Post[] = [];
          querySnapshot.forEach((doc) => {
            _posts.unshift(doc.data());
          });

          setPosts(_posts);
        },
        (error) => {
          console.error("Error fetching posts:", error);
        }
      );
      return () => {
        postsUnsubscribe();
      };
    }
  }, [user]);

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
