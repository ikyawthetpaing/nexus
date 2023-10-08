import { useMemo, useState } from "react";
import { Post } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dimensions, Pressable, View } from "react-native";
import ImageView from "react-native-image-viewing";

import { AvatarImage } from "@/components/ui/avatar-image";
import { Icons } from "@/components/icons";
import { ImagesList } from "@/components/images-list";
import { Text } from "@/components/themed";
import { UserLink } from "@/components/user-link";
import { getStyles } from "@/constants/style";
import {
  usePostLikeCountSnapshot,
  usePostReplyCountSnapshot,
  useUserLikedSnapshot,
  useUserSnapshot,
} from "@/hooks/snapshots";
import { useTheme } from "@/context/theme";
import { getAuthUser } from "@/firebase/auth";
import { handleFirebaseError } from "@/firebase/error-handler";
import { toggleLike } from "@/firebase/firestore";
import { formatCount, timeAgo } from "@/lib/utils";

interface PostItemProps {
  post: Post;
  isReplyTo?: boolean;
}

export default function PostItem({ post, isReplyTo }: PostItemProps) {
  const { border, accent, mutedForeground, background } = useTheme();
  const {
    padding,
    borderWidthSmall,
    avatarSizeSm: avatarSizeSmall,
  } = getStyles();

  const authUserId = useMemo(() => getAuthUser()?.uid || "", []);
  const { user: author } = useUserSnapshot(post.authorId);
  const { likeCount } = usePostLikeCountSnapshot(post.id);
  const { replyCount } = usePostReplyCountSnapshot(post.id);
  const { liked } = useUserLikedSnapshot(post.id, authUserId);

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  async function onLike() {
    try {
      if (authUserId) {
        await toggleLike({ postId: post.id, userId: authUserId });
      }
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  // const replies = dmReplies.filter(({ replyToId }) => replyToId === post.id);

  return (
    <View>
      <Pressable onPress={() => router.push(`/(base)/(modal)/post/${post.id}`)}>
        {({ pressed }) => (
          <View
            style={[
              {
                position: "relative",
                paddingBottom: padding,
                backgroundColor: background,
              },
              pressed && { backgroundColor: accent },
              !isReplyTo && {
                borderBottomWidth: borderWidthSmall,
                borderBottomColor: border,
              },
            ]}
          >
            {/* left */}
            <View
              style={{
                paddingHorizontal: padding,
                position: "absolute",
                top: padding,
                bottom: 0,
              }}
            >
              {/* <UserLink userId={post.authorId}> */}
              <AvatarImage
                uri={author?.avatar?.uri || null}
                style={{ width: avatarSizeSmall }}
              />
              {/* </UserLink> */}
              {/* {post.repliesCount > 0 ||
                (isReplyTo && (
                  <>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        marginTop: padding,
                      }}
                    >
                      <Separator
                        size={borderWidthLarge}
                        orientation="vertical"
                      />
                    </View>
                    <RepliesReference replies={replies} />
                  </>
                ))} */}
            </View>

            {/* header */}
            <View
              style={{
                margin: padding,
                marginLeft: avatarSizeSmall + padding * 2,
                marginBottom: 0,
                height: avatarSizeSmall,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <UserLink userId={post.authorId}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "500", fontSize: 16 }}>
                      {author?.name}
                    </Text>
                    {author?.verified && (
                      <Icons.verified size={16} color="#60a5fa" />
                    )}
                  </View>
                  <Text style={{ color: mutedForeground }}>
                    @{author?.username}
                  </Text>
                </View>
              </UserLink>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={{ color: "gray" }}>{timeAgo(post.createdAt)}</Text>
                <Feather name="more-horizontal" size={14} color="gray" />
              </View>
            </View>

            {/* content */}
            {post.content && (
              <View
                style={{
                  marginLeft: avatarSizeSmall + padding * 2,
                  marginTop: padding,
                }}
              >
                <Text>{post.content}</Text>
              </View>
            )}

            {/* post images */}
            {post.images && (
              <ImagesList
                images={post.images}
                style={{
                  paddingLeft: avatarSizeSmall + padding * 2,
                  paddingRight: padding,
                  marginTop: padding,
                }}
                width={
                  Dimensions.get("screen").width -
                  (avatarSizeSmall + padding * 2)
                }
                onClickImage={(i) => {
                  setImageViewingVisible(true);
                  setViewImage(i);
                }}
              />
            )}

            {/* footer */}
            <View
              style={{
                marginLeft: avatarSizeSmall + padding * 2,
                marginTop: padding,
                marginRight: padding,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: padding,
              }}
            >
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                onPress={onLike}
              >
                <Icons.heart
                  size={18}
                  color={liked ? "red" : mutedForeground}
                  filled={liked}
                />
                <Text style={{ color: "gray" }}>{formatCount(likeCount)}</Text>
              </Pressable>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                onPress={() => router.push(`/post/${post.id}/reply`)}
              >
                <Icons.comment size={18} color={mutedForeground} />
                <Text style={{ color: "gray" }}>{formatCount(replyCount)}</Text>
              </Pressable>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Icons.squareShare size={18} color={mutedForeground} />
                <Text style={{ color: "gray" }}>0</Text>
              </Pressable>
              <Pressable>
                <Icons.share size={18} color={mutedForeground} />
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
      {post.images && post.images.length > 0 && (
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

// interface RepliesReferenceProps {
//   replies: Post[];
// }

// function RepliesReference({ replies }: RepliesReferenceProps) {
//   const { background } = useThemedColors();
//   const { borderWidthLarge } = getStyles();

//   const avatarSize = 20;

//   const [repliersImage, setRepliersImage] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchedImages: string[] = [];

//     replies.slice(0, 3).map((reply) => {
//       const userImage = getUserImage(reply.authorId);
//       if (userImage) {
//         fetchedImages.push(userImage);
//       }
//     });

//     setRepliersImage(fetchedImages);
//   }, [replies]);

//   function getUserImage(userId: string) {
//     const user = users.find(({ id }) => id === userId);
//     return user?.avatar?.uri;
//   }

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         justifyContent: "center",
//       }}
//     >
//       {repliersImage.map((uri, i) => (
//         <AvatarImage
//           key={i}
//           size={avatarSize}
//           uri={uri}
//           style={[
//             { borderWidth: borderWidthLarge, borderColor: background },
//             i !== 0 && { marginLeft: -(avatarSize / 2) },
//           ]}
//         />
//       ))}
//     </View>
//   );
// }
