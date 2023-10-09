import { ChatMessage, EditableUser, Follow, Like, Post, User } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  updateDoc,
} from "firebase/firestore";

import { FIREBASE_DB, FIRESTORE_COLLECTIONS } from "@/firebase/config";
import { mergeStrings } from "@/lib/utils";

// converters
export function createFirestoreConverter<T>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ) => {
      const convertedData = snapshot.data(options) as T;
      return convertedData;
    },
  };
}

export const userConverter = createFirestoreConverter<User>();
export const postConverter = createFirestoreConverter<Post>();
export const likeConverter = createFirestoreConverter<Like>();
export const followConverter = createFirestoreConverter<Follow>();
export const chatMessageConverter = createFirestoreConverter<ChatMessage>();

// user
export const createUser = async (data: User) => {
  const docRef = collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.USERS);
  await setDoc(doc(docRef, data.id).withConverter(userConverter), data);
};

export const updateUser = async (data: EditableUser, userId: string) => {
  const userRef = doc(
    FIREBASE_DB,
    FIRESTORE_COLLECTIONS.USERS,
    userId
  ).withConverter(userConverter);
  await updateDoc(userRef, data);
};

export const getUser = async (userId: string) => {
  const docRef = doc(
    FIREBASE_DB,
    FIRESTORE_COLLECTIONS.USERS,
    userId
  ).withConverter(userConverter);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

// post
export async function createPost(data: Post) {
  const docRef = collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.POSTS);
  await setDoc(doc(docRef, data.id).withConverter(postConverter), data);

  return { id: data.id };
}

export async function getPost(postId: string) {
  const docRef = doc(
    FIREBASE_DB,
    FIRESTORE_COLLECTIONS.POSTS,
    postId
  ).withConverter(postConverter);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function getRepliesToParent(rootRelpyToId: string | null) {
  const posts: Post[] = [];
  let previousReplyToId = rootRelpyToId;

  while (previousReplyToId !== null) {
    const replyToPost = await getPost(previousReplyToId);
    if (replyToPost) {
      posts.unshift(replyToPost);
      previousReplyToId = replyToPost.replyToId;
    } else {
      break;
    }
  }

  return posts;
}

// like
export function mergeLikeId({ postId, userId }: Like) {
  return mergeStrings(postId, userId);
}

export async function toggleLike({ postId, userId }: Like) {
  const likeId = mergeLikeId({ postId, userId });
  const likeRef = doc(FIREBASE_DB, FIRESTORE_COLLECTIONS.LIKES, likeId);

  const likeDoc = await getDoc(likeRef);

  if (likeDoc.exists()) {
    await deleteDoc(likeRef);
    return null;
  } else {
    await setDoc(likeRef, { postId, userId });
    return { id: likeId };
  }
}

// follow
export function mergeFollowId({ followerId, followingId }: Follow) {
  return mergeStrings(followerId, followingId);
}

export async function toggleFollow({ followerId, followingId }: Follow) {
  if (followerId === followingId) {
    return;
  }

  const followId = mergeFollowId({ followerId, followingId });
  const followRef = doc(FIREBASE_DB, FIRESTORE_COLLECTIONS.FOLLOWS, followId);

  const followDoc = await getDoc(followRef);

  if (followDoc.exists()) {
    await deleteDoc(followRef);
    return null;
  } else {
    await setDoc(followRef, { followerId, followingId });
    return { id: followId };
  }
}

// chat message
export async function createChatMessage(data: ChatMessage) {
  const docRef = collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.MESSAGES);
  await setDoc(doc(docRef, data.id).withConverter(chatMessageConverter), data);
}
