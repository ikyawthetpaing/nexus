import { forwardRef, useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { Text } from "@/components/themed";
import { Icons } from "@/components/icons";
import { router } from "expo-router";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/context/user";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { IconButton } from "@/components/ui/icon-button";
import * as ImagePicker from "expo-image-picker";
import { LocalImage, User } from "@/types";

type AddPostType = {
  content: string;
  images: LocalImage[];
};

export default function PostScreen() {
  const { user } = useCurrentUser();
  if (!user) {
    return null;
  }

  const headerAndFooterHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;

  const snapPoints = ["25%", "50%"];

  const {
    border,
    accent,
    background,
    accentForeground,
    mutedForeground,
    foreground,
  } = getThemedColors();
  const { padding } = getStyles();

  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);

  const [editingFocus, setEditingFocus] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [posts, setPosts] = useState<AddPostType[]>([
    { content: "", images: [] },
  ]);
  const [currentEditIndex, setCurrentEditIndex] = useState(posts.length - 1);

  useEffect(() => {
    if (editingFocus) {
      inputRef.current?.focus();
    }
  }, [currentEditIndex, editingFocus]);

  function isPostsHasEmptyContent() {
    let result = false;
    for (let post of posts) {
      if (!post.content && !post.images.length) {
        result = true;
        break;
      }
    }
    return result;
  }

  function onPressPost() {
    console.log(posts);
  }

  function onPressAddReplies() {
    if (posts.length === 0 || posts[posts.length - 1].content) {
      setPosts([...posts, { content: "", images: [] }]);

      setCurrentEditIndex(posts.length);
      setEditingFocus(true);
    } else {
      setCurrentEditIndex(posts.length - 1);
      setEditingFocus(true);
    }
  }

  function onPressRemovePost(index: number) {
    if (posts.length === 1 && index === 0) {
      const newValue: AddPostType = {
        content: "",
        images: [],
      };
      setPosts([newValue]);
    } else {
      const newValues = [...posts];
      newValues.splice(index, 1);
      if (!newValues[currentEditIndex]) {
        setCurrentEditIndex(newValues.length - 1);
      }
      setPosts(newValues);
      setEditingFocus(false);
    }
  }

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages: LocalImage[] = [];

      result.assets.map((file) => {
        const newImage: LocalImage = {
          uri: file.uri,
          width: file.width,
          height: file.height,
        };
        newImages.push(newImage);
      });

      const newValues = [...posts];

      const newValue: AddPostType = {
        content: newValues[currentEditIndex].content,
        images: [...newValues[currentEditIndex].images, ...newImages],
      };

      newValues.splice(currentEditIndex, 1, newValue);
      setPosts(newValues);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <View style={[{ flex: 1 }]}>
        {/* header */}
        <View
          style={{
            height: HEADER_HEIGHT,
            paddingTop: STATUSBAR_HEIGHT,
            overflow: "hidden",
            paddingHorizontal: padding,
            borderBottomWidth: 0.5,
            borderBottomColor: border,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()}>
            {({ pressed }) => (
              <Icons.close
                color={pressed ? accentForeground : foreground}
                size={24}
              />
            )}
          </Pressable>
          <Button
            size="sm"
            disabled={isPostsHasEmptyContent()}
            onPress={onPressPost}
          >
            Post
          </Button>
        </View>
        {/* content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}
        >
          {/* firt post input */}
          {posts.map((post, i) => (
            <PostEditorItem
              user={user}
              post={post}
              firstChild={i === 0}
              lastChild={i === posts.length - 1}
              onFocus={() => setCurrentEditIndex(i)}
              ref={currentEditIndex === i ? inputRef : undefined}
              onChangeText={(text) => {
                const newValues = [...posts];
                const newValue: AddPostType = {
                  content: text,
                  images: newValues[i].images,
                };
                newValues.splice(i, 1, newValue);
                setPosts(newValues);
              }}
              removePost={() => onPressRemovePost(i)}
            />
          ))}
        </ScrollView>
        {/* footer */}
        <View>
          <Pressable onPress={handlePresentModal}>
            {({ pressed }) => (
              <View
                style={[
                  {
                    padding: padding,
                    borderTopWidth: 0.5,
                    borderTopColor: border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: padding,
                  },
                  pressed && { backgroundColor: accent },
                ]}
              >
                <Icons.earth size={20} />
                <Text>Everyone can reply</Text>
              </View>
            )}
          </Pressable>

          <View
            style={{
              height: headerAndFooterHeight,
              overflow: "hidden",
              paddingHorizontal: padding,
              borderTopWidth: 0.5,
              borderTopColor: border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: padding }}>
              <IconButton icon="photo" onPress={pickImageAsync} />
              <IconButton icon="videoFramePlay" />
              <IconButton icon="checklist" />
              <IconButton icon="mapPoint" />
            </View>
            <View style={{ flexDirection: "row", gap: padding }}>
              <IconButton icon="addCircle" />
              <View style={{ width: 1, backgroundColor: border }} />
              <IconButton icon="addCircle" onPress={onPressAddReplies} />
            </View>
          </View>
        </View>
      </View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{
            borderRadius: 32,
            borderWidth: 1,
            borderColor: border,
          }}
          onDismiss={() => setIsOpen(false)}
        >
          <View
            style={{ flex: 1, marginTop: 16, paddingHorizontal: padding * 2 }}
          >
            <Text>Some content</Text>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

interface PostEditorItemProps {
  user: Pick<User, 'avatar' | 'username'>;
  post: AddPostType;
  firstChild: boolean;
  lastChild: boolean;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  removePost: () => void;
}

const PostEditorItem = forwardRef<TextInput,PostEditorItemProps>(({
  user,
  post,
  firstChild,
  lastChild,
  onChangeText,
  onFocus,
  removePost,
}, ref) => {
  const { border, accent, background } = getThemedColors();
  const { padding, avatarSizeSmall: avatarSize } = getStyles();

  const renderLeftBorder = () => {
    if (!lastChild) {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View
            style={{
              flex: 1,
              borderLeftWidth: 2,
              borderLeftColor: border,
            }}
          />
        </View>
      );
    }
    return null;
  };

  const renderAvatar = () => (
    <View>
      <View style={{ padding: padding, backgroundColor: background }}>
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: accent,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {user.avatar && (
            <Image
              source={{ uri: user.avatar.uri }}
              style={{
                width: '100%',
                height: "100%",
                resizeMode: 'cover',
              }}
            />
          )}
        </View>
      </View>
    </View>
  );

  const renderRemoveButton = () => {
    if (!(firstChild && !post.content && !post.images.length)) {
      return (
        <View style={{ paddingRight: padding, paddingTop: padding }}>
          <IconButton icon="close" size={14} onPress={removePost} />
        </View>
      );
    }
    return null;
  };

  const renderImages = () => {
    if (post.images.length > 0) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            gap: padding,
            paddingRight: padding,
            paddingLeft: 40 + padding * 2,
            height: 300,
          }}
        >
          {post.images.map((value, index) => (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={index}
            >
              <Image
                source={{ uri: value.uri }}
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: value.width / value.height,
                  borderRadius: 12,
                }}
              />
            </View>
          ))}
        </ScrollView>
      );
    }
    return null;
  };

  return (
    <View style={{ position: 'relative', paddingBottom: padding }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: avatarSize + padding * 2,
        }}
      >
        {renderLeftBorder()}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {renderAvatar()}
        <View style={{ flex: 1, paddingTop: padding }}>
          <Text style={{ fontWeight: '500' }}>@{user.username}</Text>
          <Input
            ref={ref}
            onFocus={onFocus}
            placeholder="What's happening?"
            multiline={true}
            numberOfLines={1}
            variant="underline"
            maxLength={265}
            style={{ borderBottomWidth: 0 }}
            value={post.content}
            onChangeText={onChangeText}
          />
        </View>
        {renderRemoveButton()}
      </View>
      {renderImages()}
    </View>
  );
})