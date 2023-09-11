import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Text } from "@/components/themed";
import { Icons } from "@/components/icons";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { IconButton } from "@/components/ui/icon-button";
import * as ImagePicker from "expo-image-picker";
import { AddPostType, LocalImage, Post, User } from "@/types";
import { ImagesList } from "@/components/images-list";
import { AvatarImage } from "@/components/ui/avatar-image";
import { Separator } from "@/components/ui/separator";
import ImageView from "react-native-image-viewing";
import { isPostsHasEmptyContent } from "@/lib/utils";
import { getPost, getUser } from "@/firebase/database";
import { useCurrentUser } from "@/context/current-user";

interface PostEditorProps {
  posts: AddPostType[];
  setPosts: Dispatch<SetStateAction<AddPostType[]>>;
  action: "post" | "reply";
  onCancel: () => void;
  onSubmit: () => void;
  replyToPostId?: string;
}

export function PostEditor({
  posts,
  setPosts,
  onCancel,
  onSubmit,
  action,
  replyToPostId,
}: PostEditorProps) {
  const { user: currentUser } = useCurrentUser();

  const { border, accent, background, accentForeground, foreground } =
    getThemedColors();
  const { padding } = getStyles();
  const headerAndFooterHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;
  const snapPoints = ["25%", "50%"];

  if (!currentUser) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  const [editingFocus, setEditingFocus] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(posts.length - 1);
  const [replyToPost, setReplyToPost] = useState<{
    post: Post;
    author: User;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      let post: Post | null = null;
      let author: User | null = null;

      if (replyToPostId) {
        post = await getPost(replyToPostId);
        if (post) {
          author = await getUser(post.authorId);
          if (author) {
            setReplyToPost({ post, author });
          }
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (editingFocus) {
      inputRef.current?.focus();
    }
  }, [currentEditIndex, editingFocus]);

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
    const newValues = [...posts];

    if (posts.length === 1 && index === 0) {
      newValues[index] = { content: "", images: [] };
    } else {
      newValues.splice(index, 1);
    }

    if (!newValues[currentEditIndex]) {
      setCurrentEditIndex(newValues.length - 1);
    }

    setPosts(newValues);
    setEditingFocus(false);
  }

  function removeImage(postIndex: number, imageIndex: number) {
    const updatedPosts = [...posts];
    if (postIndex >= 0 && postIndex < updatedPosts.length) {
      if (
        imageIndex >= 0 &&
        imageIndex < updatedPosts[postIndex].images.length
      ) {
        updatedPosts[postIndex].images.splice(imageIndex, 1);
        setPosts(updatedPosts);
      } else {
        console.error(
          `Invalid imageIndex (${imageIndex}) for postIndex (${postIndex})`
        );
      }
    } else {
      console.error(`Invalid postIndex (${postIndex})`);
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
          <Pressable onPress={onCancel}>
            {({ pressed }) => (
              <Icons.close
                color={pressed ? accentForeground : foreground}
                size={24}
              />
            )}
          </Pressable>
          <Button
            size="sm"
            disabled={isPostsHasEmptyContent(posts)}
            onPress={onSubmit}
          >
            {action === "post" ? "Post" : "Reply"}
          </Button>
        </View>
        {/* content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}
        >
          {replyToPost && action === "reply" && (
            <ReplyTotem post={replyToPost.post} author={replyToPost.author} />
          )}

          {/* firt post input */}
          {posts.map((post, i) => (
            <PostEditorItem
              key={i}
              user={currentUser}
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
              removeImage={(imageIndex) => removeImage(i, imageIndex)}
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

interface ReplyToItemProps {
  post: Post;
  author: User;
}

function ReplyTotem({ post, author }: ReplyToItemProps) {
  const { padding, avatarSizeSmall } = getStyles();
  const paddingLeft = avatarSizeSmall + padding * 2;

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  return (
    <View style={{ position: "relative", paddingBottom: padding }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: paddingLeft,
        }}
      >
        <View style={{ padding: padding }}>
          <AvatarImage size={avatarSizeSmall} uri={author.avatar?.uri ?? ""} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Separator orientation="vertical" size={2} />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingLeft: paddingLeft,
          marginBottom: padding,
        }}
      >
        <View style={{ flex: 1, paddingTop: padding, gap: 4 }}>
          <Text style={{ fontWeight: "500" }}>@{author.username}</Text>
          <Text>{post.content}</Text>
        </View>
      </View>
      {post.images && (
        <>
          <ImagesList
            images={post.images}
            style={{ paddingLeft: paddingLeft, paddingRight: padding }}
            width={Dimensions.get("screen").width - paddingLeft}
            onClickImage={(i) => {
              setImageViewingVisible(true);
              console.log(i);
              setViewImage(i);
            }}
          />
          <ImageView
            images={post.images}
            imageIndex={viewImage}
            visible={imageViewingVisible}
            onRequestClose={() => setImageViewingVisible(false)}
            keyExtractor={(src, index) => `${src}_${index}`}
            presentationStyle="overFullScreen"
          />
        </>
      )}
    </View>
  );
}

interface PostEditorItemProps {
  user: Pick<User, "avatar" | "username">;
  post: AddPostType;
  firstChild: boolean;
  lastChild: boolean;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  removePost: () => void;
  removeImage: (i: number) => void;
}

const PostEditorItem = forwardRef<TextInput, PostEditorItemProps>(
  (
    {
      user,
      post,
      firstChild,
      lastChild,
      onChangeText,
      onFocus,
      removePost,
      removeImage,
    },
    ref
  ) => {
    const { padding, avatarSizeSmall, borderWidthLarge } = getStyles();
    const paddingLeft = avatarSizeSmall + padding * 2;

    const [imageViewingVisible, setImageViewingVisible] = useState(false);
    const [viewImage, setViewImage] = useState(0);

    return (
      <View style={{ position: "relative", paddingBottom: padding }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: avatarSizeSmall + padding * 2,
          }}
        >
          <View style={{ padding: padding }}>
            <AvatarImage size={avatarSizeSmall} uri={user.avatar?.uri || ""} />
          </View>
          {!lastChild && (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Separator orientation="vertical" size={borderWidthLarge} />
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", paddingLeft: paddingLeft }}>
          <View style={{ flex: 1, paddingTop: padding }}>
            <Text style={{ fontWeight: "500" }}>@{user.username}</Text>
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
          {!(firstChild && !post.content && !post.images.length) && (
            <View style={{ paddingRight: padding, paddingTop: padding }}>
              <IconButton icon="close" size={14} onPress={removePost} />
            </View>
          )}
        </View>
        <ImagesList
          images={post.images}
          style={{ paddingLeft: paddingLeft, paddingRight: padding }}
          width={Dimensions.get("screen").width - paddingLeft}
          onClickImage={(i) => {
            setImageViewingVisible(true);
            console.log(i);
            setViewImage(i);
          }}
          onRemoveImage={removeImage}
        />
        {post.images.length > 0 && (
          <ImageView
            images={post.images}
            imageIndex={viewImage}
            visible={imageViewingVisible}
            onRequestClose={() => setImageViewingVisible(false)}
            keyExtractor={(src, index) => `${src}_${index}`}
            presentationStyle="overFullScreen"
          />
        )}
      </View>
    );
  }
);
