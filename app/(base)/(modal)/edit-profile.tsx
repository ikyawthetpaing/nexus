import { useEffect, useState } from "react";
import { EditableUser } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Image } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertFooter,
  AlertFooterButton,
  AlertTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Header, HEADER_HEIGHT } from "@/components/header";
import LoadingScreen from "@/components/loading";
import { Text, View } from "@/components/themed";
import { useThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { useCurrentUser } from "@/context/current-user";
import { StoragePath } from "@/firebase/config";
import { updateUser } from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
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
  const { user } = useCurrentUser();

  const { accent, mutedForeground } = useThemedColors();
  const { padding } = getStyles();

  const [selectedImage, setSelectedImage] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();

  const [originalData, setOriginalData] = useState<EditableUser | null>(user);
  const [formData, setFormData] = useState<EditableUser | null>(user);
  const [uploading, setUploading] = useState(false);
  const [dialogVisiable, setDailogVisiable] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    setOriginalData(user);
    setFormData(user);
    setPreviewImage(user?.avatar?.uri);
    setSelectedImage(undefined);
  }, [user]);

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

  function onPressBack() {
    if (!isDataChanged) {
      router.back();
    } else {
      setDailogVisiable(true);
    }
  }

  async function onPressSave() {
    if (
      originalData &&
      formData &&
      (hasDataChanged(originalData, formData) || selectedImage)
    ) {
      setUploading(true);
      try {
        let uploadedFile = user?.avatar || null;
        if (selectedImage) {
          if (user?.avatar) {
            await deleteFileFromFirebase({ cloudPath: user.avatar.path });
          }
          uploadedFile = await uploadFileToFirebase({
            localFilePath: selectedImage,
            storagePath: StoragePath.Avatars,
          });
        }
        if (user && formData) {
          const uploadData: EditableUser = {
            ...formData,
            avatar: uploadedFile,
          };
          await updateUser(uploadData, user.id);
        }
      } catch (error) {
        handleFirebaseError(error);
      } finally {
        setUploading(false);
      }
    }
  }

  if (!user || !originalData || !formData) {
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
          <Button size="sm" onPress={onPressSave} disabled={!isDataChanged}>
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
                setFormData({ ...formData, username: text })
              }
            />
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
      <Alert visible={dialogVisiable}>
        <AlertTitle>Unsaved changes</AlertTitle>
        <AlertDescription>
          You have unsaved changes. Are you sure you want to cancel?
        </AlertDescription>
        <AlertFooter>
          <AlertFooterButton
            textStyle={{ fontWeight: "500", color: "#60a5fa" }}
            onPress={() => router.back()}
          >
            Yes
          </AlertFooterButton>
          <AlertFooterButton onPress={() => setDailogVisiable(false)}>
            No
          </AlertFooterButton>
        </AlertFooter>
      </Alert>
    </View>
  );
}
