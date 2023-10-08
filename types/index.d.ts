export type AppConfig = {
  name: string;
  url: string;
  authors: { name: string; url: string }[];
  creator: string;

  profileNavItems: NavItem[];
};

export type NavItem = {
  title: string;
  slug: string;
};

export type FirebaseUploadedFile = {
  path: string;
  uri: string;
};

export type LocalImage = Omit<FirebaseUploadedFile, "path"> & {
  width: number;
  height: number;
};

export type UploadedImage = FirebaseUploadedFile & {
  width: number;
  height: number;
};

export type User = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  verified: boolean;
  avatar: FirebaseUploadedFile | null;
  email: string;
};
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
  createdAt: Timestamp;
};

export type Like = {
  postId: string;
  userId: string;
};

export type Follow = {
  followerId: string;
  followingId: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Timestamp;
};

export type SendingChatMessage = Pick<ChatMessage, "id" | "content">;
