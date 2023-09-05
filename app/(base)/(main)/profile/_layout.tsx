import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { Header } from "@/components/header";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { View } from "@/components/themed";
import { Icons } from "@/components/icons";
import { Slot, router } from "expo-router";
import { useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { useCurrentUser } from "@/context/user";

export default function ProfileLayout() {
  const { background, mutedForeground, primary } = getThemedColors();
  const { padding } = getStyles();

  const [profileHeaderHeight, setProfileHeaderHeight] = useState(0);

  const scrollY = new Animated.Value(0);

  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const { user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={background} />
      <Header scrollY={scrollY}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: padding,
          }}
        >
          <View>
            <Pressable>
              {({ pressed }) => (
                <Icons.world color={pressed ? primary : mutedForeground} />
              )}
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: padding }}>
            <Pressable onPress={() => router.push("/post")}>
              {({ pressed }) => (
                <Icons.add color={pressed ? primary : mutedForeground} />
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/settings")}>
              {({ pressed }) => (
                <Icons.menu color={pressed ? primary : mutedForeground} />
              )}
            </Pressable>
          </View>
        </View>
      </Header>
      <ProfileHeader
        user={user}
        scrollY={scrollY}
        getHeight={(e) => setProfileHeaderHeight(e)}
      />
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{
          backgroundColor: background
        }}
      >
        <View style={{ marginTop: profileHeaderHeight }}>
          <Slot />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
