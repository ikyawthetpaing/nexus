import { DocumentCollection, FIREBASE_DB } from "@/firebase/config";
import { EditableUser, User } from "@/types";
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// Define a Firestore data converter for User documents
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

export const createUserProfile = async (user: User) => {
  try {
    const docRef = collection(FIREBASE_DB, DocumentCollection.Users);
    await setDoc(doc(docRef, user.email).withConverter(userConverter), {
      name: user.name,
      username: user.username,
      bio: user.bio,
      verified: user.verified,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (user: EditableUser, id: string) => {
  try {
    const userRef = doc(FIREBASE_DB, DocumentCollection.Users, id);
    await updateDoc(userRef, {
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error updated user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (id: string) => {
  try {
    const docRef = doc(FIREBASE_DB, DocumentCollection.Users, id).withConverter(
      userConverter
    );
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
