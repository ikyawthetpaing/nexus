import { useEffect, useState } from "react";
import { ChatMessage } from "@/types";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { or, where } from "firebase/firestore";
import { Pressable, TextInput } from "react-native";

import { AvatarImage } from "@/components/ui/avatar-image";
import { Icons } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { ScrollViewWithHeader } from "@/components/view-with-header";
import { getStyles } from "@/constants/style";
import { useChatMessageSnapshot, useUserSnapshot } from "@/hooks/snapshots";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";
import { mergeStrings } from "@/lib/utils";

export default function MessageScreen() {
  const { accent, foreground, mutedForeground } = useTheme();
  const { user: currentUser } = useCurrentUser();

  const { padding } = getStyles();

  const { messages } = useChatMessageSnapshot(
    or(
      where("receiverId", "==", currentUser.id),
      where("senderId", "==", currentUser.id)
    )
  );

  const [latestMessages, setLatestMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const _latestMessages: ChatMessage[] = [];
    const uniqueIds = new Set<string>();

    messages.reverse().forEach((message) => {
      const id1 = mergeStrings(message.receiverId, message.senderId);
      const id2 = mergeStrings(message.senderId, message.receiverId);

      if (!uniqueIds.has(id1) && !uniqueIds.has(id2)) {
        uniqueIds.add(id1);
        uniqueIds.add(id2);
        _latestMessages.push(message);
      }
    });

    setLatestMessages(_latestMessages);
  }, [messages]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollViewWithHeader
        headerChildren={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: padding,
              position: "relative",
              gap: padding,
            }}
          >
            <View
              style={{
                top: 0,
                bottom: 0,
                aspectRatio: 1,
                borderRadius: 9999,
                backgroundColor: accent,
                overflow: "hidden",
              }}
            >
              {currentUser.avatar && (
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
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Pressable
                style={{ zIndex: 10, position: "absolute", left: padding }}
              >
                <Icons.search size={18} color={foreground} />
              </Pressable>
              <TextInput
                placeholder="Search"
                placeholderTextColor={mutedForeground}
                style={{
                  position: "absolute",
                  backgroundColor: accent,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 9999,
                  paddingLeft: padding * 3.5,
                }}
              />
            </View>
          </View>
        }
        // contentContainerStyle={{
        //   minHeight: layout.height + HEADER_HEIGHT,
        // }}
      >
        {latestMessages.map((message, i) => (
          <ChatItem
            key={i}
            latestMessage={message}
            currentUserId={currentUser.id}
          />
        ))}
      </ScrollViewWithHeader>
    </View>
  );
}

function ChatItem({
  latestMessage,
  currentUserId,
}: {
  latestMessage: ChatMessage;
  currentUserId: string;
}) {
  const { receiverId, senderId } = latestMessage;
  const { mutedForeground } = useTheme();
  const { padding, avatarSizeMd } = getStyles();
  const otherId = receiverId !== currentUserId ? receiverId : senderId;
  const { user: other } = useUserSnapshot(otherId);

  if (!other) {
    return null;
  }

  return (
    <Link
      href={{
        pathname: "/(base)/(modal)/chat/[id]/",
        params: { id: other.id },
      }}
    >
      <View
        style={{
          padding: padding,
          flexDirection: "row",
          gap: padding,
          alignItems: "center",
        }}
      >
        <AvatarImage
          uri={other.avatar?.uri || null}
          style={{ width: avatarSizeMd }}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "500", fontSize: 16 }}>
              {other.name}
            </Text>
            {other.verified && <Icons.verified size={16} color="#60a5fa" />}
            <Text style={{ fontWeight: "500", color: mutedForeground }}>
              {"\u00B7"}
            </Text>
            <Text style={{ color: mutedForeground }}>1m</Text>
          </View>
          <Text
            style={{
              color: mutedForeground,
            }}
            numberOfLines={1}
          >
            {latestMessage.content}
          </Text>
        </View>
      </View>
    </Link>
  );
}
