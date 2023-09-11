import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Text, View } from "@/components/themed";
import { router } from "expo-router";
import { getStyles } from "@/constants/style";
import { Button } from "@/components/ui/button";
import { getThemedColors } from "@/constants/colors";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/user";
import { EditableUser } from "@/types";
import { handleFirebaseError } from "@/firebase/error-handler";
import {
  deleteFileFromFirebase,
  uploadFileToFirebase,
} from "@/firebase/storage";
import LoadingScreen from "@/components/loading";
import { StoragePath } from "@/firebase/config";
import { updateUser } from "@/firebase/database";
import { HEADER_HEIGHT, Header } from "@/components/header";
import { IconButton } from "@/components/ui/icon-button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogFooterButton,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function EditProfile() {
  const { user, setRefresh } = useCurrentUser();

  if (!user) {
    return null;
  }

  const { accent, mutedForeground } = getThemedColors();
  const { padding } = getStyles();

  const [selectedImage, setSelectedImage] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();

  const [originalData, setOriginalData] = useState<EditableUser>(user);
  const [formData, setFormData] = useState<EditableUser>(user);
  const [uploading, setUploading] = useState(false);
  const [dialogVisiable, setDailogVisiable] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    setOriginalData(user);
    setFormData(user);
    setPreviewImage(user.avatar?.uri);
    setSelectedImage(undefined);
  }, [user]);

  useEffect(() => {
    setIsDataChanged(hasDataChanged(originalData, formData) || !!selectedImage);
  }, [formData, selectedImage]);

  useEffect(() => {
    if (selectedImage) {
      setPreviewImage(selectedImage);
    }
  }, [selectedImage]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
    if (hasDataChanged(originalData, formData) || selectedImage) {
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
        if (user?.email) {
          const uploadData: EditableUser = {
            ...formData,
            avatar: uploadedFile,
          };
          await updateUser(uploadData, user.id);
        } else {
          alert("Unauthrouzed.");
        }
      } catch (error) {
        handleFirebaseError(error);
      } finally {
        setUploading(false);
        setRefresh(true);
      }
    }
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
          <IconButton icon="close" onPress={onPressBack} size={24} />
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
      <Dialog visible={dialogVisiable}>
        <DialogTitle>Unsaved changes</DialogTitle>
        <DialogDescription>
          You have unsaved changes. Are you sure you want to cancel?
        </DialogDescription>
        <DialogFooter>
          <DialogFooterButton
            textStyle={{ fontWeight: "500", color: "#60a5fa" }}
            onPress={() => router.back()}
          >
            Yes
          </DialogFooterButton>
          <DialogFooterButton onPress={() => setDailogVisiable(false)}>
            No
          </DialogFooterButton>
        </DialogFooter>
      </Dialog>
    </View>
  );
}
