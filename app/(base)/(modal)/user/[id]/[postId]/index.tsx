import { useEffect, useState } from "react";
import { Post, User } from "@/types";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import ImageView from "react-native-image-viewing";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { ImagesList } from "@/components/images-list";
import LoadingScreen from "@/components/loading";
import PostItem from "@/components/post-item";
import { Text } from "@/components/themed";
import { UserLink } from "@/components/user-link";
import { useThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { useCurrentUser } from "@/context/current-user";
import { DBCollections, FIREBASE_DB } from "@/firebase/config";
import {
  getRepliesToParent,
  likeConverter,
  mergeLikeId,
  postConverter,
  toggleLike,
  userConverter,
} from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
import { formatCount, formatDate, formatHour } from "@/lib/utils";

export default function UserPostDetailScreen() {
  const { user } = useCurrentUser();

  const { postId: _postId } = useLocalSearchParams();
  const postId = typeof _postId === "string" ? _postId : "";

  const { background, mutedForeground, accent, muted, border } =
    useThemedColors();
  const { padding, avatarSizeSmall, borderWidthSmall } = getStyles();

  const footerHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [repliesTo, setRepliesTo] = useState<Post[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postUnsubscribe = onSnapshot(
      doc(FIREBASE_DB, DBCollections.Posts, postId).withConverter(
        postConverter
      ),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setPost(docSnapshot.data() || null);
          setLoading(false);
        } else {
          setPost(null);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    );

    return () => {
      postUnsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    if (post) {
      const authorUnsubscribe = onSnapshot(
        doc(FIREBASE_DB, DBCollections.Users, post.authorId).withConverter(
          userConverter
        ),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setAuthor(docSnapshot.data() || null);
          } else {
            setAuthor(null);
          }
        },
        (error) => {
          console.error("Error fetching author:", error);
        }
      );

      const repliesQuery = query(
        collection(FIREBASE_DB, DBCollections.Posts),
        where("replyToId", "==", post.id)
      ).withConverter(postConverter);
      const repliesUnsubscribe = onSnapshot(
        repliesQuery,
        (querySnapshot) => {
          const _replies: Post[] = [];
          querySnapshot.forEach((doc) => {
            _replies.push(doc.data());
          });

          setReplies(_replies);
        },
        (error) => {
          console.error("Error fetching replies:", error);
        }
      );

      getRepliesToParent(post.replyToId).then((result) => setRepliesTo(result));

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

      const unsubLiked = onSnapshot(
        doc(
          FIREBASE_DB,
          DBCollections.Likes,
          mergeLikeId({ postId: post.id, userId: user?.id || "" })
        ).withConverter(likeConverter),
        (doc) => {
          setLiked(!!doc.data() || false);
        }
      );

      return () => {
        authorUnsubscribe();
        repliesUnsubscribe();
        likeCountUnsubscribe();
        replyCountUnsubscribe();
        unsubLiked();
      };
    }
  }, [post]);

  async function onLike() {
    try {
      if (post && user) {
        await toggleLike({ postId: post.id, userId: user.id });
        setLiked(!liked);
      }
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!post || !author) {
    return null; // not found
  }

  return (
    <View
      style={{ flex: 1, position: "relative", backgroundColor: background }}
    >
      {/* header */}
      <View>
        <View
          style={{
            height: HEADER_HEIGHT,
            paddingTop: STATUSBAR_HEIGHT,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: padding,
            gap: padding * 2,
            borderBottomWidth: borderWidthSmall,
            borderBottomColor: border,
          }}
        >
          <IconButton
            icon="arrowLeft"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push("/");
              }
            }}
          />
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Post</Text>
        </View>
      </View>

      <ScrollView
        style={{ marginBottom: footerHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* reply to posts */}
        {repliesTo?.map((post) => (
          <PostItem post={post} key={post.id} isReplyTo={true} />
        ))}

        {/* post */}
        <View style={{ gap: padding }}>
          {/* post header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: padding,
              paddingTop: padding,
            }}
          >
            <View style={{ flexDirection: "row", gap: padding }}>
              <UserLink userId={post.authorId}>
                <View
                  style={{
                    width: avatarSizeSmall,
                    height: avatarSizeSmall,
                    borderRadius: avatarSizeSmall / 2,
                    backgroundColor: accent,
                    overflow: "hidden",
                  }}
                >
                  {author?.avatar && (
                    <Image
                      source={{ uri: author.avatar.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      contentFit="cover"
                    />
                  )}
                </View>
              </UserLink>
              <UserLink userId={author.id}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {author.name}
                  </Text>
                  <Text style={{ color: mutedForeground }}>
                    @{author.username}
                  </Text>
                </View>
              </UserLink>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: padding,
                alignItems: "center",
              }}
            >
              <Button size="sm">Follow</Button>
              <IconButton icon="menuDots" iconProps={{ size: 24 }} />
            </View>
          </View>

          {/* content */}
          {post.content && (
            <View style={{ paddingHorizontal: padding }}>
              <Text style={{ fontSize: 16 }}>{post.content}</Text>
            </View>
          )}

          {/* images viewer */}
          {post.images && (
            <ImagesList
              images={post.images}
              style={{
                paddingHorizontal: padding,
              }}
              width={Dimensions.get("screen").width - padding}
              onClickImage={(i) => {
                setImageViewingVisible(true);
                setViewImage(i);
              }}
            />
          )}

          {/* post footer */}
          <View
            style={{
              paddingHorizontal: padding,
              borderBottomWidth: borderWidthSmall,
              borderBottomColor: border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: padding / 2,
                paddingBottom: padding,
                borderBottomWidth: borderWidthSmall,
                borderBottomColor: border,
              }}
            >
              <Text style={{ color: mutedForeground }}>
                {formatHour(post.createdAt)}
              </Text>
              <Text style={{ fontWeight: "500", color: mutedForeground }}>
                {"\u00B7"}
              </Text>
              <Text style={{ color: mutedForeground }}>
                {formatDate(post.createdAt)}
              </Text>
              <Text style={{ fontWeight: "500", color: mutedForeground }}>
                {"\u00B7"}
              </Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ fontWeight: "500" }}>{formatCount(25555)}</Text>
                <Text style={{ color: mutedForeground }}>Views</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: padding,
                paddingVertical: padding,
                borderBottomWidth: borderWidthSmall,
                borderBottomColor: border,
              }}
            >
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ fontWeight: "500" }}>
                  {formatCount(likeCount)}
                </Text>
                <Text style={{ color: mutedForeground }}>Likes</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ fontWeight: "500" }}>
                  {formatCount(replyCount)}
                </Text>
                <Text style={{ color: mutedForeground }}>Replies</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ fontWeight: "500" }}>
                  {formatCount(post.repostsCount)}
                </Text>
                <Text style={{ color: mutedForeground }}>Reposts</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: padding,
              }}
            >
              <IconButton
                icon="heart"
                iconProps={{
                  size: 18,
                  filled: liked,
                  color: liked ? "red" : undefined,
                }}
                onPress={onLike}
              />
              <IconButton
                icon="comment"
                iconProps={{ size: 18 }}
                onPress={() =>
                  router.push(`/user/${post.authorId}/${post.id}/reply`)
                }
              />
              <IconButton icon="squareShare" iconProps={{ size: 18 }} />
              <IconButton icon="share" iconProps={{ size: 18 }} />
            </View>
          </View>
        </View>

        {/* replies */}
        {replies.map((reply) => (
          <PostItem post={reply} key={reply.id} />
        ))}
      </ScrollView>

      {/* footer */}
      <View
        style={{
          borderTopWidth: borderWidthSmall,
          borderTopColor: border,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: footerHeight,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => router.push(`/user/${post.authorId}/${post.id}/reply`)}
        >
          {({ pressed }) => (
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: muted,
                  borderRadius: footerHeight,
                  margin: padding,
                  flexDirection: "row",
                  gap: padding,
                  alignItems: "center",
                  paddingLeft: padding,
                },
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20 / 2,
                  backgroundColor: accent,
                  overflow: "hidden",
                }}
              >
                {user?.avatar && (
                  <Image
                    source={{ uri: user.avatar.uri }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    contentFit="cover"
                  />
                )}
              </View>
              <Text style={{ color: mutedForeground }}>
                Reply to {author.username}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* image viewer */}
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
