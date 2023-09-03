import { Pressable, ViewProps } from "react-native";
import { Image } from "expo-image";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Post } from "@/types";
import { Text, View } from "@/components/themed";
import { timeAgo } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { getStyles } from "@/constants/style";
import { getThemedColors } from "@/constants/colors";

interface PostItemProps extends ViewProps {
  post: Post;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function PostItem({ post, style }: PostItemProps): JSX.Element {
  const { border } = getThemedColors();
  const { padding, radius, borderWidth } = getStyles();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          gap: 6,
          padding: padding,
          borderBottomWidth: borderWidth,
          borderBottomColor: border,
        },
        style,
      ]}
    >
      <PostLeftSide {...post} />
      <View style={{ flexShrink: 1, flex: 1, gap: padding }}>
        <View style={{ gap: 6 }}>
          <PostHeading
            name={post.author?.name}
            verified={post.author?.verified}
            createdAt={post.createdAt}
          />
          <Text>{post.content}</Text>
          {post.image && (
            <View>
              <Image
                source={post.image}
                style={{ borderRadius: radius, minHeight: 300 }}
                placeholder={blurhash}
                contentFit="cover"
                transition={500}
              />
            </View>
          )}
        </View>
        <PostFooter replies={post.repliesCount} likes={post.likesCount} />
      </View>
    </View>
  );
}

function PostLeftSide(post: Post) {
  const SIZE = 40
  return (
    <View>
      <Image
        source={post.author?.avatar}
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE/2 }}
        placeholder={blurhash}
        contentFit="cover"
        transition={500}
      />
    </View>
  );
}

function PostHeading({
  name,
  createdAt,
  verified,
}: {
  name: string;
  createdAt: string;
  verified: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexGrow: 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontWeight: "500" }}>{name}</Text>
        {verified && <Icons.verified size={14} color="#60a5fa" />}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ color: "gray" }}>{timeAgo(createdAt)}</Text>
        <Feather name="more-horizontal" size={14} color="gray" />
      </View>
    </View>
  );
}

function PostFooter({ replies, likes }: { replies: number; likes: number }) {
  const iconSize = 18;
  const { mutedForeground } = getThemedColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Icons.heart size={iconSize} color={mutedForeground} filled={false} />
        <Text style={{ color: "gray" }}>{likes}</Text>
      </Pressable>
      <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Icons.comment size={iconSize} color={mutedForeground} />
        <Text style={{ color: "gray" }}>{replies}</Text>
      </Pressable>
      <AntDesign name="retweet" size={iconSize} color={mutedForeground} />
      <Pressable>
        <Icons.share size={iconSize} color={mutedForeground} />
      </Pressable>
    </View>
  );
}
