import { Dimensions, Pressable, ViewProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Post, User } from "@/types";
import { formatCount, timeAgo } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { getStyles } from "@/constants/style";
import { getThemedColors } from "@/constants/colors";
import { replies as dmReplies, users } from "@/constants/dummy-data";
import { Text } from "@/components/themed";
import { View } from "react-native";
import { useEffect, useState } from "react";
import ImageView from "react-native-image-viewing";
import { router } from "expo-router";
import { UserLink } from "@/components/user-link";
import { AvatarImage } from "@/components/ui/avatar-image";
import { Separator } from "@/components/ui/separator";
import { ImagesList } from "@/components/images-list";
import { getUserProfile } from "@/firebase/database";

interface PostItemProps extends ViewProps {
  post: Post;
}

export default function PostItem({ post, style }: PostItemProps): JSX.Element {
  const { border, accent, mutedForeground, background } = getThemedColors();
  const { padding, borderWidthSmall, borderWidthLarge, avatarSizeSmall } =
    getStyles();

  const [author, setAuthor] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserProfile(post.authorId);
      setAuthor(user);
    };
    fetchData();
  }, []);
  
  const replies = dmReplies.filter(({ replyToId }) => replyToId === post.id);

  const [imageViewingVisible, setImageViewingVisible] = useState(false);
  const [viewImage, setViewImage] = useState(0);

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
                borderBottomWidth: borderWidthSmall,
                borderBottomColor: border,
              },
              pressed && { backgroundColor: accent },
            ]}
          >
            {/* left */}
            <View
              style={{
                paddingHorizontal: padding,
                paddingBottom: 0,
                position: "absolute",
                top: padding,
                bottom: padding,
                gap: padding,
              }}
            >
              <UserLink userId={post.authorId}>
                <AvatarImage
                  size={avatarSizeSmall}
                  uri={author?.avatar?.uri || ""}
                />
              </UserLink>
              {post.repliesCount > 0 && (
                <>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Separator size={borderWidthLarge} orientation="vertical" />
                  </View>
                  <RepliesReference replies={replies} />
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
  const { background } = getThemedColors();
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
