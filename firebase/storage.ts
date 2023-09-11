import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FIREBASE_STORAGE, StoragePath } from "@/firebase/config";
import { FirebaseUploadedFile } from "@/types";
import { appConfig } from "@/config/app";
import cuid from "cuid";

type UploadFileToFirebaseType = {
  localFilePath: string;
  storagePath: StoragePath;
};

export const uploadFileToFirebase = async ({
  localFilePath,
  storagePath,
}: UploadFileToFirebaseType) => {
  const uniqueFileName = `${appConfig.name.toUpperCase()}_IMG_${cuid()}.jpg`;
  const remotePath = `${storagePath}/${uniqueFileName}`;

  const storageRef = ref(FIREBASE_STORAGE, remotePath);

  try {
    const response = await fetch(localFilePath);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const fileUrl = await getDownloadURL(storageRef);
    return { path: remotePath, uri: fileUrl } as FirebaseUploadedFile;
  } catch (error) {
    throw error;
  }
};

export const deleteFileFromFirebase = async ({
  cloudPath,
}: {
  cloudPath: string;
}) => {
  const storageRef = ref(FIREBASE_STORAGE, cloudPath);
  await deleteObject(storageRef);
};
