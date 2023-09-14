import { useEffect, useState } from "react";
import { Post, User } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { Dimensions, Pressable, View } from "react-native";
import ImageView from "react-native-image-viewing";

import { AvatarImage } from "@/components/ui/avatar-image";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { ImagesList } from "@/components/images-list";
import { Text } from "@/components/themed";
import { UserLink } from "@/components/user-link";
import { useThemedColors } from "@/constants/colors";
import { replies as dmReplies, users } from "@/constants/dummy-data";
import { getStyles } from "@/constants/style";
import { useCurrentUser } from "@/context/current-user";
import { DBCollections, FIREBASE_DB } from "@/firebase/config";
import {
  likeConverter,
  mergeLikeId,
  toggleLike,
  userConverter,
} from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
import { formatCount, timeAgo } from "@/lib/utils";

interface PostItemProps {
  post: Post;
  isReplyTo?: boolean;
}

export default function PostItem({ post, isReplyTo }: PostItemProps) {
  const { border, accent, mutedForeground, background } = useThemedColors();
  const { padding, borderWidthSmall, borderWidthLarge, avatarSizeSmall } =
    getStyles();

  const { user: currentUser } = useCurrentUser();

  const [author, setAuthor] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  useEffect(() => {
    const authorUnsubscribe = onSnapshot(
      doc(FIREBASE_DB, DBCollections.Users, post.authorId).withConverter(
        userConverter
      ),
      (doc) => {
        setAuthor(doc.data() || null);
      }
    );

    const likeCountQuery = query(
      collection(FIREBASE_DB, DBCollections.Likes),
      where("postId", "==", post.id)
    ).withConverter(likeConverter);

    const likeCountUnsubscribe = onSnapshot(
      likeCountQuery,
      (querySnapshot) => {
        setLikeCount(querySnapshot.docs.length);
      },
      (error) => {
        console.error("Error fetching like count:", error);
      }
    );

    const replyCountQuery = query(
      collection(FIREBASE_DB, DBCollections.Posts),
      where("replyToId", "==", post.id)
    ).withConverter(likeConverter);

    const replyCountUnsubscribe = onSnapshot(
      replyCountQuery,
      (querySnapshot) => {
        setReplyCount(querySnapshot.docs.length);
      },
      (error) => {
        console.error("Error fetching reply count:", error);
      }
    );

    return () => {
      authorUnsubscribe();
      likeCountUnsubscribe();
      replyCountUnsubscribe();
    };
  }, [post]);

  useEffect(() => {
    if (currentUser) {
      const likedUnsubscribe = onSnapshot(
        doc(
          FIREBASE_DB,
          DBCollections.Likes,
          mergeLikeId({ postId: post.id, userId: currentUser.id })
        ).withConverter(likeConverter),
        (doc) => {
          if (doc.exists()) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        }
      );

      return () => {
        likedUnsubscribe();
      };
    }
  }, [currentUser, post]);

  async function onLike() {
    try {
      if (currentUser) {
        await toggleLike({ postId: post.id, userId: currentUser.id });
      }
      setLiked(!liked);
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  const replies = dmReplies.filter(({ replyToId }) => replyToId === post.id);

  return (
    <>
      <Pressable
        onPress={() =>
          router.push(`/(base)/(modal)/user/${post.authorId}/${post.id}`)
        }
      >
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
              <UserLink userId={post.authorId}>
                <AvatarImage
                  size={avatarSizeSmall}
                  uri={author?.avatar?.uri || ""}
                />
              </UserLink>
              {post.repliesCount > 0 ||
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
                ))}
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
                onPress={() =>
                  router.push(`/user/${post.authorId}/${post.id}/reply`)
                }
              >
                <Icons.comment size={18} color={mutedForeground} />
                <Text style={{ color: "gray" }}>{formatCount(replyCount)}</Text>
              </Pressable>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Icons.squareShare size={18} color={mutedForeground} />
                <Text style={{ color: "gray" }}>
                  {formatCount(post.repliesCount)}
                </Text>
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
    </>
  );
}

interface RepliesReferenceProps {
  replies: Post[];
}

function RepliesReference({ replies }: RepliesReferenceProps) {
  const { background } = useThemedColors();
  const { borderWidthLarge } = getStyles();

  const avatarSize = 20;

  const [repliersImage, setRepliersImage] = useState<string[]>([]);

  useEffect(() => {
    const fetchedImages: string[] = [];

    replies.slice(0, 3).map((reply) => {
      const userImage = getUserImage(reply.authorId);
      if (userImage) {
        fetchedImages.push(userImage);
      }
    });

    setRepliersImage(fetchedImages);
  }, [replies]);

  function getUserImage(userId: string) {
    const user = users.find(({ id }) => id === userId);
    return user?.avatar?.uri;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {repliersImage.map((uri, i) => (
        <AvatarImage
          key={i}
          size={avatarSize}
          uri={uri}
          style={[
            { borderWidth: borderWidthLarge, borderColor: background },
            i !== 0 && { marginLeft: -(avatarSize / 2) },
          ]}
        />
      ))}
    </View>
  );
}
