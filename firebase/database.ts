import { DocumentCollection, FIREBASE_DB } from "@/firebase/config";
import { CreatePost, EditableUser, Post, User } from "@/types";
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getCurrentUser } from "./authentication";
import cuid from "cuid";

// user
const userConverter = {
  toFirestore: (user: User) => {
    return user;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options) as User;
    return data;
  },
};

export const createUser = async (userData: User) => {
  try {
    const docRef = collection(FIREBASE_DB, DocumentCollection.Users);
    await setDoc(
      doc(docRef, userData.id).withConverter(userConverter),
      userData
    );
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUser = async (userData: EditableUser, userId: string) => {
  try {
    const userRef = doc(
      FIREBASE_DB,
      DocumentCollection.Users,
      userId
    ).withConverter(userConverter);
    await updateDoc(userRef, {
      name: userData.name,
      username: userData.username,
      bio: userData.bio,
      avatar: userData.avatar,
    });
  } catch (error) {
    console.error("Error updated user profile:", error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const docRef = doc(
      FIREBASE_DB,
      DocumentCollection.Users,
      userId
    ).withConverter(userConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// post
const postConverter = {
  toFirestore: (postData: Post) => {
    return postData;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const postData = snapshot.data(options) as Post;
    return postData;
  },
};

export async function createPost(data: CreatePost) {
  try {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      throw Error("Unauthorized.");
    }

    const postId = cuid();

    const createPostData: Post = {
      id: postId,
      authorId: currentUser.uid,
      content: data.content,
      images: data.images,
      replyToId: data.replyToId,
      createdAt: Timestamp.fromDate(new Date()),
      likesCount: 0,
      repliesCount: 0,
      repostsCount: 0,
    };

    const docRef = collection(FIREBASE_DB, DocumentCollection.Posts);
    await setDoc(
      doc(docRef, postId).withConverter(postConverter),
      createPostData
    );

    return { id: postId };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function getPost(postId: string) {
  try {
    const docRef = doc(
      FIREBASE_DB,
      DocumentCollection.Posts,
      postId
    ).withConverter(postConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

export async function getReplies(postId: string) {
  try {
    const postsQuery = query(
      collection(FIREBASE_DB, DocumentCollection.Posts),
      where("replyToId", "==", postId)
    ).withConverter(postConverter);

    const querySnapshot = await getDocs(postsQuery);
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error("Error getting post replies:", error);
    throw error;
  }
}

export const getUserPosts = async (userId: string) => {
  try {
    const postsQuery = query(
      collection(FIREBASE_DB, DocumentCollection.Posts),
      and(where("authorId", "==", userId), where("replyToId", "==", null))
    ).withConverter(postConverter);

    const querySnapshot = await getDocs(postsQuery);
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// just for dev
export async function getAllPosts() {
  const querySnapshot = await getDocs(
    collection(FIREBASE_DB, DocumentCollection.Posts).withConverter(
      postConverter
    )
  );
  const posts = querySnapshot.docs.map((doc) => doc.data());
  return posts;
}
