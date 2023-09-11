import React, { createContext, useContext, useState, useMemo } from "react";
import { Post, User } from "@/types";

interface TempStorageContextType {
  users: {
    data: User[];
    addUser: (userData: User) => void;
    getUser: (userId: string) => User | null;
  };
  posts: {
    data: Post[];
    addPost: (postData: Post) => void;
    getPost: (postId: string) => Post | null;
  };
}

const TempStorageContext = createContext<TempStorageContextType | undefined>(
  undefined
);

export function useTempStorage() {
  const context = useContext(TempStorageContext);
  if (!context) {
    throw new Error("useTempStorage must be used within a StorageContextProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function TempStorageProvider({ children }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const userContext: TempStorageContextType = useMemo(() => {
    return {
      users: {
        data: users,
        addUser: (userData) => {
          setUsers((prevUsers) => [...prevUsers, userData]);
        },
        getUser: (userId) => {
          return users.find(({ id }) => id === userId) || null;
        },
      },
      posts: {
        data: posts,
        addPost: (postData) => {
          setPosts((prevPosts) => [...prevPosts, postData]);
        },
        getPost: (postId) => {
          return posts.find(({ id }) => id === postId) || null;
        },
      },
    };
  }, [users, posts]);

  return (
    <TempStorageContext.Provider value={userContext}>
      {children}
    </TempStorageContext.Provider>
  );
}
