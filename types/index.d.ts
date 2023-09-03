import { Href } from "expo-router";

export type AppConfig = {
  name: string;
  url: string;
  authors: { name: string; url: string }[];
  creator: string;
};

export type NavItem = {
  title: string;
  slug: Href;
};

export type FirebaseUploadedFile = {
  path: string;
  url: string;
};

export interface User {
  name: string;
  username: string;
  bio: string | null;
  verified: boolean;
  avatar: FirebaseUploadedFile | null;
  email: string;
}

export type EditableUser = Omit<User, "verified" | "email">;

// development
export interface Reply {
  id: string;
  author: User;
  content: string;
  likes: number;
  createdAt: string;
}

export type Post = {
  id: string;
  author: User;
  content: string;
  image?: string;
  replies?: Reply[];
  repliesCount: number;
  likesCount: number;
  mention?: boolean;
  mentionUser: User;
  createdAt: string;
};
