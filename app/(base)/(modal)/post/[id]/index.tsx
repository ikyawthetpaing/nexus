import { useEffect, useState } from "react";
import { Post } from "@/types";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import ImageView from "react-native-image-viewing";

import { IconButton } from "@/components/ui/icon-button";
import { FollowButton } from "@/components/follow-button";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { ImagesList } from "@/components/images-list";
import { LoadingScreen } from "@/components/loading-screen";
import PostItem from "@/components/post-item";
import { Text } from "@/components/themed";
import { UserLink } from "@/components/user-link";
import { getStyles } from "@/constants/style";
import {
  usePostLikeCountSnapshot,
  usePostRepliesSnapshot,
  usePostReplyCountSnapshot,
  usePostSnapshot,
  useUserLikedSnapshot,
  useUserSnapshot,
} from "@/hooks/snapshots";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";
import { handleFirebaseError } from "@/firebase/error-handler";
import { getRepliesToParent, toggleLike } from "@/firebase/firestore";
import { formatCount, formatDate, formatHour } from "@/lib/utils";
import NotFoundScreen from "@/app/[...missing]";

export default function PostScreen() {
  const { background, mutedForeground, accent, muted, border } = useTheme();
  const {
    padding,
    avatarSizeSm: avatarSizeSmall,
    borderWidthSmall,
  } = getStyles();

  const { user: currentUser } = useCurrentUser();
  const { id } = useLocalSearchParams();
  const postId = typeof id === "string" ? id : "";

  const footerHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;

  const [repliesTo, setRepliesTo] = useState<Post[]>([]);

  const { post, loading: postLoading } = usePostSnapshot(postId);
  const { user: author, loading: authorLoading } = useUserSnapshot(
    post?.authorId || ""
  );
  const { likeCount } = usePostLikeCountSnapshot(postId);
  const { replyCount } = usePostReplyCountSnapshot(postId);
  const { liked } = useUserLikedSnapshot(postId, currentUser.id);
  const { replies } = usePostRepliesSnapshot(postId);

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  useEffect(() => {
    if (post) {
      getRepliesToParent(post.replyToId).then((result) => setRepliesTo(result));
    }
  }, [post]);

  async function onLike() {
    try {
      if (post) {
        await toggleLike({ postId: post.id, userId: currentUser.id });
      }
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  if (postLoading || authorLoading) {
    return <LoadingScreen />;
  }

  if (!post || !author) {
    return <NotFoundScreen />;
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
              {post.authorId !== currentUser.id && (
                <FollowButton
                  size="sm"
                  follow={{
                    followerId: currentUser.id,
                    followingId: post.authorId,
                  }}
                />
              )}
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
                <Text style={{ fontWeight: "500" }}>0</Text>
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
                onPress={() => router.push(`/post/${post.id}/reply`)}
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
          onPress={() => router.push(`/post/${post.id}/reply`)}
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
                {currentUser?.avatar && (
                  <Image
                    source={{ uri: currentUser.avatar.uri }}
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
