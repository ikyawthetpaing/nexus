import { Dimensions, Pressable, ScrollView, ViewProps } from "react-native";
import { Image } from "expo-image";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Post } from "@/types";
import { formatCount, timeAgo } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { getStyles } from "@/constants/style";
import { getThemedColors } from "@/constants/colors";
import { replies, users } from "@/constants/dummy-data";
import { Text } from "@/components/themed";
import { View } from "react-native";
import { useState } from "react";
import ImageView from "react-native-image-viewing";
import { Link, router } from "expo-router";
import { UserLink } from "./user-link";

interface PostItemProps extends ViewProps {
  post: Post;
}

export default function PostItem({ post, style }: PostItemProps): JSX.Element {
  const { border, foreground, accent, mutedForeground } = getThemedColors();
  const {
    padding,
    borderRadius,
    borderWidthSmall,
    borderWidthLarge,
    avatarSizeSmall,
  } = getStyles();

  const author = users.find(({ id }) => id === post.authorId);
  const reples = replies.filter(({ replyTo }) => replyTo === post.id);

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

  return (
    <>
      <Pressable onPress={() => router.push(`/(base)/(modal)/user/${post.authorId}/${post.id}`)}>
        {({ pressed }) => (
          <View
            style={[
              {
                position: "relative",
                paddingBottom: padding,
                borderBottomWidth: borderWidthSmall,
                borderBottomColor: border,
              },
              pressed && { backgroundColor: accent },
            ]}
          >
            {/* left */}
            <View
              style={{
                padding: padding,
                paddingBottom: 0,
                position: "absolute",
                top: 0,
                bottom: 0,
              }}
            >
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
              {post.repliesCount > 0 && (
                <>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      marginTop: padding / 2,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        width: borderWidthLarge,
                        backgroundColor: border,
                        borderRadius: borderWidthLarge / 2,
                      }}
                    />
                  </View>
                  <View style={{ padding: padding, paddingTop: padding / 2 }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
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
                  </View>
                </>
              )}
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
            {post.images && post.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  gap: padding,
                  paddingLeft: avatarSizeSmall + padding * 2,
                  paddingRight: padding,
                  maxHeight:
                    post.images[0].height < 600 ? post.images[0].height : 600,
                  marginTop: padding,
                }}
              >
                {post.images.map((value, index) => (
                  <Pressable
                    key={value.uri + index}
                    style={[
                      {
                        aspectRatio: value.width / value.height,
                        borderRadius: borderRadius,
                        overflow: "hidden",
                      },
                      index === 0 && {
                        width:
                          Dimensions.get("screen").width -
                          (avatarSizeSmall +
                            padding *
                              (post.images?.length && post.images.length > 1
                                ? 4
                                : 3)),
                      },
                    ]}
                    onPress={() => {
                      setImageViewingVisible(true);
                      setViewImage(index);
                    }}
                  >
                    {({ pressed }) => (
                      <Image
                        source={{ uri: value.uri }}
                        style={[
                          {
                            flex: 1,
                          },
                          pressed && { opacity: 0.75 },
                        ]}
                      />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
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
              >
                <Icons.heart size={18} color={mutedForeground} filled={false} />
                <Text style={{ color: "gray" }}>
                  {formatCount(post.likesCount)}
                </Text>
              </Pressable>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Icons.comment size={18} color={mutedForeground} />
                <Text style={{ color: "gray" }}>
                  {formatCount(post.repliesCount)}
                </Text>
              </Pressable>
              <AntDesign name="retweet" size={18} color={mutedForeground} />
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
