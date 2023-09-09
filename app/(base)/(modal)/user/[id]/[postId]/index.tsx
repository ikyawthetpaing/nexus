import { Dimensions, Pressable, ScrollView, StatusBar } from "react-native";

import { posts, replies as dmReplies, users } from "@/constants/dummy-data";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Text, View } from "@/components/themed";
import { Icons } from "@/components/icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollViewWithHeader } from "@/components/view-with-header";
import { IconButton } from "@/components/ui/icon-button";
import { UserLink } from "@/components/user-link";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { formatCount, formatDate, formatHour } from "@/lib/utils";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { useCurrentUser } from "@/context/user";
import ImageView from "react-native-image-viewing";
import { useState } from "react";
import PostItem from "@/components/post-item";
import { ImagesList } from "@/components/images-list";

export default function UserPostPage() {
  const { postId } = useLocalSearchParams();

  const post = posts.find(({ id }) => id === postId);
  const replies = dmReplies.filter(({ replyToId }) => replyToId === postId);

  const author = users.find(({ id }) => id === post?.authorId);
  const { user } = useCurrentUser();

  if (!post || !author) {
    return null; // implement like post not found
  }

  const { background, mutedForeground, primary, accent, muted, border } =
    getThemedColors();
  const { padding, avatarSizeSmall, borderRadius, borderWidthSmall } =
    getStyles();
  const footerHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  return (
    <View style={{ flex: 1, position: "relative" }}>
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
          <IconButton icon="arrowLeft" onPress={() => router.back()} />
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Post</Text>
        </View>
      </View>

      <ScrollView style={{ marginBottom: footerHeight }} showsVerticalScrollIndicator={false}>
        {/* post item */}
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
              <IconButton icon="menuDots" size={24} />
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
                  {formatCount(post.likesCount)}
                </Text>
                <Text style={{ color: mutedForeground }}>Likes</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={{ fontWeight: "500" }}>
                  {formatCount(post.repliesCount)}
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
              <IconButton size={18} icon="heart" />
              <IconButton size={18} icon="comment" />
              <IconButton size={18} icon="squareShare" />
              <IconButton size={18} icon="share" />
            </View>
          </View>
        </View>

        {/* replies */}
        {replies.map((reply, index) => (
          <PostItem post={reply} key={index} />
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
