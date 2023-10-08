import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ChatMessage, SendingChatMessage } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { and, or, Timestamp, where } from "firebase/firestore";
import { Keyboard, Pressable, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { AvatarImage } from "@/components/ui/avatar-image";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/spinner";
import { Text, View } from "@/components/themed";
import { getStyles } from "@/constants/style";
import { useChatMessageSnapshot, useUserSnapshot } from "@/hooks/snapshots";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";
import { createChatMessage } from "@/firebase/firestore";
import { getUniqueString } from "@/lib/utils";

export default function ChatGroupScreen() {
  const { mutedForeground, accent, border } = useTheme();
  const { padding, avatarSizeLg, avatarSizeSm, borderWidthSmall } = getStyles();
  const { id } = useLocalSearchParams();
  const { user: currentUser } = useCurrentUser();
  const receiverId = typeof id === "string" ? id : "";

  const { user: receiver } = useUserSnapshot(receiverId);

  const scrollViewRef = useRef<ScrollView>(null);
  const { messages } = useChatMessageSnapshot(
    or(
      and(
        where("receiverId", "==", receiverId),
        where("senderId", "==", currentUser.id)
      ),
      and(
        where("senderId", "==", receiverId),
        where("receiverId", "==", currentUser.id)
      )
    )
  );
  const [sendingMessages, setSendingMessages] = useState<SendingChatMessage[]>(
    []
  );

  const scrollDown = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Scroll to the end of the ScrollView after a short delay
    const scrollTimer = setTimeout(() => {
      scrollDown();
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages]);

  useEffect(() => scrollDown(), [sendingMessages]);

  useEffect(() => {
    if (!uploading) {
      const message = sendingMessages[0];
      if (message) {
        const data: ChatMessage = {
          content: message.content,
          receiverId,
          senderId: currentUser.id,
          createdAt: Timestamp.now(),
          id: getUniqueString(),
        };
        createChatMessage(data)
          .then(() => {
            const newSendMessages = sendingMessages.filter(
              (_message) => _message.id !== message.id
            );
            setSendingMessages(newSendMessages);
            setUploading(false);
          })
          .catch((error) => {
            console.error("Error creating chat message:", error);
            setUploading(false);
          });
      }
    }
  }, [sendingMessages, uploading]);

  if (!receiver) {
    return null;
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: padding,
          marginTop: STATUSBAR_HEIGHT,
          borderBottomWidth: borderWidthSmall,
          borderBottomColor: border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: padding,
            alignItems: "center",
          }}
        >
          <IconButton icon="arrowLeft" onPress={() => router.back()} />
          <View style={{ flexDirection: "row", gap: padding }}>
            <AvatarImage
              uri={receiver.avatar?.uri || null}
              style={{ width: avatarSizeSm }}
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
                  {receiver.name}
                </Text>
                {receiver.verified && (
                  <Icons.verified size={16} color="#60a5fa" />
                )}
              </View>
              <Text style={{ color: mutedForeground }}>
                @{receiver.username}
              </Text>
            </View>
          </View>
        </View>
        <IconButton icon="menu" />
      </View>
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingTop: padding * 4,
            alignItems: "center",
            gap: padding,
          }}
        >
          <AvatarImage
            uri={receiver.avatar?.uri || null}
            style={{ width: avatarSizeLg }}
          />
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                {receiver.name}
              </Text>
              {receiver.verified && (
                <Icons.verified size={16} color="#60a5fa" />
              )}
            </View>
            <Text style={{ color: mutedForeground }}>@{receiver.username}</Text>
            {receiver.bio && (
              <View style={{ maxWidth: 300 }}>
                <Text style={{ color: mutedForeground, textAlign: "center" }}>
                  {receiver.bio}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            gap: padding,
            paddingHorizontal: padding,
            paddingVertical: padding * 4,
          }}
        >
          {messages.map((message, i) => (
            <View
              key={i}
              style={
                message.senderId === currentUser.id
                  ? { alignItems: "flex-end" }
                  : {}
              }
            >
              <View
                style={[
                  { padding: padding, borderRadius: padding, maxWidth: "75%" },
                  message.senderId === currentUser.id
                    ? { backgroundColor: "skyblue", borderBottomRightRadius: 0 }
                    : { backgroundColor: accent, borderBottomLeftRadius: 0 },
                ]}
              >
                <Text>{message.content}</Text>
              </View>
            </View>
          ))}
          {sendingMessages.map((message, i) => (
            <View key={i} style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row", gap: padding }}>
                <View
                  style={{
                    padding: padding,
                    borderRadius: padding,
                    maxWidth: "75%",
                    backgroundColor: "skyblue",
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Text>{message.content}</Text>
                </View>
                <View style={{ justifyContent: "flex-end" }}>
                  <Spinner />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <MessageInput
        setSendingMessages={setSendingMessages}
        onFocus={scrollDown}
      />
    </View>
  );
}

interface MessageInputProps {
  setSendingMessages: Dispatch<SetStateAction<SendingChatMessage[]>>;
  onFocus: () => void;
}

function MessageInput({ setSendingMessages, onFocus }: MessageInputProps) {
  const { border, accent, mutedForeground } = useTheme();
  const { padding, borderWidthSmall } = getStyles();
  const height = 48;
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState("");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      onFocus();
    }
  }, [open]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setOpen(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  function onPressSend() {
    setSendingMessages((prev) => [
      ...prev,
      { content: value, id: getUniqueString() },
    ]);
    setValue("");
  }

  return (
    <View
      style={{
        padding: padding,
        borderTopWidth: borderWidthSmall,
        borderTopColor: border,
      }}
    >
      <View
        style={{
          overflow: "hidden",
          borderRadius: height / 2,
          backgroundColor: accent,
        }}
      >
        {open && (
          <Input
            ref={inputRef}
            style={{
              padding: padding,
              height: "auto",
              maxHeight: 256,
            }}
            multiline
            placeholder="Send a message"
            value={value}
            onChangeText={(text) => setValue(text)}
          />
        )}

        <View
          style={[
            {
              height: height,
              backgroundColor: accent,
              flexDirection: "row",
              padding: padding,
              gap: padding,
            },
            open && { justifyContent: "space-between" },
          ]}
        >
          <IconButton
            icon="photo"
            iconProps={{ size: 24 }}
            style={{
              justifyContent: "center",
              zIndex: 10,
            }}
          />
          {!open && (
            <Pressable
              style={{
                justifyContent: "center",
                flex: 1,
              }}
              onPress={() => setOpen(true)}
            >
              <Text style={{ color: mutedForeground }} numberOfLines={1}>
                {value ? value : "Send a message"}
              </Text>
            </Pressable>
          )}
          <IconButton
            icon="send"
            style={{
              justifyContent: "center",
            }}
            onPress={onPressSend}
          />
        </View>
      </View>
    </View>
  );
}
