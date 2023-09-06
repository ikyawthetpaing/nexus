import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSsTKxR8VYfdi4AjM0XAVqzD2XCu-1dWA",
  authDomain: "nexus-72a43.firebaseapp.com",
  projectId: "nexus-72a43",
  storageBucket: "nexus-72a43.appspot.com",
  messagingSenderId: "960790622497",
  appId: "1:960790622497:web:8b797da279417bbc8ece60",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export enum StoragePath {
  Avatars = "avatars",
  Posts = "posts",
}

export enum DocumentCollection {
  Users = "users",
}