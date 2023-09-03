import { useEffect, useRef, useState } from "react";
import { Image, Modal, Pressable } from "react-native";
import { View, Text } from "@/components/themed";
import { Icons } from "@/components/icons";
import { router, usePathname } from "expo-router";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/context/user";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

export default function PostScreen() {
  const { user } = useCurrentUser();
  if (!user) {
    return null;
  }

  const iconSize = 24;
  const headerAndFooterHeight = HEADER_HEIGHT - STATUSBAR_HEIGHT;

  const snapPoints = ["25%", "50%"];

  const {
    border,
    accent,
    accentForeground,
    mutedForeground,
    background,
    foreground,
  } = getThemedColors();
  const { padding } = getStyles();

  const pathname = usePathname();
  const [visible, setVisiable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);

  useEffect(() => {
    setVisiable(pathname === "/post");
  }, [pathname]);

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }

  return (
    <Modal animationType="slide" visible={visible}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[{ flex: 1 }]}>
          {/* header */}
          <View
            style={{
              height: headerAndFooterHeight,
              overflow: "hidden",
              paddingHorizontal: padding,
              borderBottomWidth: 0.5,
              borderBottomColor: border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => router.back()}>
              {({ pressed }) => (
                <Icons.closeCircle
                  color={pressed ? accentForeground : foreground}
                />
              )}
            </Pressable>
            <Button size="sm">Post</Button>
          </View>
          {/* content */}
          <View
            style={{
              padding: padding,
              flex: 1,
            }}
          >
            {/* firt post input */}
            <View
              style={{
                flexDirection: "row",
                gap: padding,
              }}
            >
              <View style={{ alignItems: "center" }}>
                {/* avatar */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: accent,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user.avatar && (
                    <Image
                      source={{ uri: user.avatar.url }}
                      style={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                      }}
                    />
                  )}
                </View>
                {/* border */}
                <View
                  style={{
                    flex: 1,
                    borderLeftWidth: 2,
                    borderLeftColor: border,
                  }}
                ></View>
              </View>
              <View>
                <Text style={{ color: mutedForeground, fontWeight: "500" }}>
                  @{user.username}
                </Text>
                <Input
                  placeholder="What's happening?"
                  multiline={true}
                  numberOfLines={2}
                  variant="underline"
                  maxLength={265}
                  style={{ borderBottomWidth: 0 }}
                />
              </View>
            </View>
          </View>
          {/* footer */}
          <View>
            <Pressable onPress={handlePresentModal}>
              {({ pressed }) => (
                <View
                  style={[
                    {
                      padding: padding,
                      borderTopWidth: 0.5,
                      borderTopColor: border,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: padding,
                    },
                    pressed && { backgroundColor: accent },
                  ]}
                >
                  <Icons.earth size={iconSize} />
                  <Text>Everyone can reply</Text>
                </View>
              )}
            </Pressable>

            <View
              style={{
                height: headerAndFooterHeight,
                overflow: "hidden",
                paddingHorizontal: padding,
                borderTopWidth: 0.5,
                borderTopColor: border,
                flexDirection: "row",
                alignItems: "center",
                gap: padding * 2,
              }}
            >
              <Pressable>
                {({ pressed }) => <Icons.photo size={iconSize} />}
              </Pressable>
              <Pressable>
                {({ pressed }) => <Icons.videoFramePlay size={iconSize} />}
              </Pressable>
              <Pressable>
                {({ pressed }) => <Icons.checklist size={iconSize} />}
              </Pressable>
              <Pressable>
                {({ pressed }) => <Icons.mapPoint size={iconSize} />}
              </Pressable>
            </View>
          </View>
        </View>
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{
              borderRadius: 32,
              borderWidth: 1,
              borderColor: border,
            }}
            onDismiss={() => setIsOpen(false)}
          >
            <View
              style={{ flex: 1, marginTop: 16, paddingHorizontal: padding * 2 }}
            >
              <Text>Some content</Text>
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Modal>
  );
}
