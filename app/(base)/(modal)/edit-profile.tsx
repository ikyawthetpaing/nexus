import { useEffect, useState } from "react";
import { EditableUser } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Image } from "react-native";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Header, HEADER_HEIGHT } from "@/components/header";
import { LoadingScreen } from "@/components/loading-screen";
import { Text, View } from "@/components/themed";
import { getStyles } from "@/constants/style";
import { useDebounce } from "@/hooks/use-debounce";
import { useAlert } from "@/context/alert";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";
import { STORAGE_PATH } from "@/firebase/config";
import { handleFirebaseError } from "@/firebase/error-handler";
import { checkUsername, updateUser } from "@/firebase/firestore";
import {
  deleteFileFromFirebase,
  uploadFileToFirebase,
} from "@/firebase/storage";

function hasDataChanged(
  original: EditableUser,
  newFormData: EditableUser
): boolean {
  return (
    original.name !== newFormData.name ||
    original.username !== newFormData.username ||
    original.bio !== newFormData.bio
  );
}

export default function EditProfileScreen() {
  const { user: currentUser } = useCurrentUser();
  const { setAlert } = useAlert();
  const { accent, mutedForeground, destructive } = useTheme();
  const { padding } = getStyles();

  const [selectedImage, setSelectedImage] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();

  const [originalData, setOriginalData] = useState<EditableUser | null>(
    currentUser
  );
  const [uploading, setUploading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [formData, setFormData] = useState<EditableUser | null>(currentUser);
  const debouncedUsername = useDebounce(formData?.username, 500);
  const [isValidUsername, setIsValidUsername] = useState(true);

  useEffect(() => {
    setOriginalData(currentUser);
    setFormData(currentUser);
    setPreviewImage(currentUser?.avatar?.uri);
    setSelectedImage(undefined);
  }, [currentUser]);

  useEffect(() => {
    if (originalData && formData) {
      setIsDataChanged(
        hasDataChanged(originalData, formData) || !!selectedImage
      );
    }
  }, [formData, selectedImage]);

  useEffect(() => {
    if (selectedImage) {
      setPreviewImage(selectedImage);
    }
  }, [selectedImage]);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (debouncedUsername) {
        const res = await checkUsername(debouncedUsername, currentUser.id);
        setIsValidUsername(res);
      }
    };
    fetch();
    console.log("Debounced username:", debouncedUsername);
  }, [debouncedUsername]);

  function onPressBack() {
    if (!isDataChanged) {
      router.back();
    } else {
      setAlert({
        title: "Unsaved changes",
        description:
          "You have unsaved changes. Are you sure you want to cancel?",
        button: [
          {
            text: "Yes",
            action: () => {
              setAlert(null);
              router.back();
            },
          },
          { text: "No", action: () => setAlert(null) },
        ],
      });
    }
  }

  async function onPressSave() {
    if (
      originalData &&
      formData &&
      (hasDataChanged(originalData, formData) || selectedImage) &&
      isValidUsername
    ) {
      setUploading(true);
      try {
        let uploadedFile = currentUser?.avatar || null;
        if (selectedImage) {
          if (currentUser?.avatar) {
            await deleteFileFromFirebase({
              cloudPath: currentUser.avatar.path,
            });
          }
          uploadedFile = await uploadFileToFirebase({
            localFilePath: selectedImage,
            storagePath: STORAGE_PATH.AVATARS,
          });
        }
        if (currentUser && formData) {
          const uploadData: EditableUser = {
            ...formData,
            avatar: uploadedFile,
          };
          await updateUser(uploadData, currentUser.id);
        }
      } catch (error) {
        handleFirebaseError(error);
      } finally {
        setUploading(false);
      }
    }
  }

  if (!currentUser || !originalData || !formData) {
    return null; // not found
  }

  if (uploading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: padding,
          }}
        >
          <IconButton
            icon="close"
            onPress={onPressBack}
            iconProps={{ size: 24 }}
          />
          <Button
            size="sm"
            onPress={onPressSave}
            disabled={!isDataChanged || !isValidUsername}
          >
            Save
          </Button>
        </View>
      </Header>
      <View
        style={{ padding: padding, gap: padding, marginTop: HEADER_HEIGHT }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ gap: padding }}>
            <Button variant="ghost" onPress={pickImageAsync}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: accent,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewImage && (
                  <Image
                    source={{ uri: previewImage }}
                    style={{
                      flex: 1,
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                )}
              </View>
            </Button>
            <Button variant="ghost" onPress={pickImageAsync}>
              Edit avatar
            </Button>
          </View>
        </View>
        <View style={{ gap: padding }}>
          <View>
            <Text style={{ color: mutedForeground }}>Name</Text>
            <Input
              variant="underline"
              placeholder="Name"
              autoCapitalize="words"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          <View>
            <Text style={{ color: mutedForeground }}>Username</Text>
            <Input
              variant="underline"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text.toLowerCase() })
              }
            />
            {!isValidUsername && (
              <Text style={{ color: destructive }}>
                Username is already taken
              </Text>
            )}
          </View>
          <View>
            <Text style={{ color: mutedForeground }}>Bio</Text>
            <Input
              placeholder="Bio"
              multiline={true}
              numberOfLines={3}
              variant="underline"
              value={formData.bio ?? ""}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
