import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from "react-native";

import { replies as dmReplies } from "@/constants/dummy-data";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Text } from "@/components/themed";
import { router, useLocalSearchParams } from "expo-router";
import { IconButton } from "@/components/ui/icon-button";
import { UserLink } from "@/components/user-link";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { formatCount, formatDate, formatHour } from "@/lib/utils";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import ImageView from "react-native-image-viewing";
import { useEffect, useState } from "react";
import PostItem from "@/components/post-item";
import { ImagesList } from "@/components/images-list";
import { Post, User } from "@/types";
import { getPost, getReplies, getUser } from "@/firebase/database";
import { useCurrentUser } from "@/context/current-user";

export default function UserPostPage() {
  const { postId } = useLocalSearchParams();

  const { background, mutedForeground, accent, muted, border } = getThemedColors();
  const { padding, avatarSizeSmall, borderWidthSmall } = getStyles();

  const footerHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;


  const [data, setData] = useState<{post: Post, author: User, replies: Post[]} | null>(null);
  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      let post: Post | null = null;
      let author: User | null = null;
      let replies: Post[] = [];

      if (typeof postId === "string") {
        post = await getPost(postId);
        if (post) {
          author = await getUser(post.authorId);
          if (author) {
            replies = await getReplies(postId);
            setData({post, author, replies})
          }
        }
      }
    }
    fetchData();
  }, []);

  const { user: currentUser } = useCurrentUser();
  
  if (!data) {
    return null; // implement like post not found
  }

  const {post, author, replies} = data;
  // const replies = dmReplies.filter(({ replyToId }) => replyToId === postId);

  return (
    <View style={{ flex: 1, position: "relative", backgroundColor: background }}>
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
          <IconButton icon="arrowLeft" onPress={() => {
            if (router.canGoBack()) {
              router.back()
            } else {
              router.push("/")
            }
          }} />
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Post</Text>
        </View>
      </View>

      <ScrollView
        style={{ marginBottom: footerHeight }}
        showsVerticalScrollIndicator={false}
      >
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
