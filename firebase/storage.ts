import { FirebaseUploadedFile } from "@/types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { appConfig } from "@/config/app";
import { FIREBASE_STORAGE, STORAGE_PATH } from "@/firebase/config";
import { getUniqueString } from "@/lib/utils";

type UploadFileToFirebaseType = {
  localFilePath: string;
  storagePath: STORAGE_PATH;
};

export const uploadFileToFirebase = async ({
  localFilePath,
  storagePath,
}: UploadFileToFirebaseType) => {
  const uniqueFileName = `${appConfig.name.toUpperCase()}_IMG_${getUniqueString()}.jpg`;
  const remotePath = `${storagePath}/${uniqueFileName}`;

  const storageRef = ref(FIREBASE_STORAGE, remotePath);

  const response = await fetch(localFilePath);
  const blob = await response.blob();

  await uploadBytes(storageRef, blob);

  const fileUrl = await getDownloadURL(storageRef);
  return { path: remotePath, uri: fileUrl } as FirebaseUploadedFile;
};

export const deleteFileFromFirebase = async ({
  cloudPath,
}: {
  cloudPath: string;
}) => {
  const storageRef = ref(FIREBASE_STORAGE, cloudPath);
  await deleteObject(storageRef);
};
