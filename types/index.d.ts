import { Href } from "expo-router";
import { typeTimestamp } from "firebase/firestore";

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
  uri: string;
};

export type LocalImage = Omit<FirebaseUploadedFile, "path"> & {
  width: number,
  height: number
}

export type UploadedImage = FirebaseUploadedFile & {
  width: number,
  height: number
}

export type User = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  verified: boolean;
  avatar: FirebaseUploadedFile | null;
  email: string;
}
export type EditableUser = Omit<User, "verified" | "email" | "id">;
export type Author = User;

export type AddPost = {
  content: string;
  images: LocalImage[];
};

export type Post = {
  id: string;
  replyToId: string | null;
  authorId: string;
  content: string | null;
  images: UploadedImage[] | null;
  repliesCount: number;
  likesCount: number;
  repostsCount: number,
  createdAt: Timestamp;
};
export type EditablePost = Pick<Post, "content" | "images">;
export type CreatePost = Pick<Post, "replyToId" | "content" | "images">;

export type Like = {
  postId: string,
  userId: string
}