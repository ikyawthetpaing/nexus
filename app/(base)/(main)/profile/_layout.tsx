import React, { useState } from "react";
import { router, Stack } from "expo-router";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Header } from "@/components/header";
import { ProfileHeader } from "@/components/profile-header";
import { View } from "@/components/themed";
import { appConfig } from "@/config/app";
import { getStyles } from "@/constants/style";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";

export default function ProfileLayout() {
  const { background } = useTheme();
  const { user: currentUser } = useCurrentUser();
  const { padding } = getStyles();

  const [profileHeaderHeight, setProfileHeaderHeight] = useState(0);

  const scrollY = new Animated.Value(0);
  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

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
          <IconButton icon="world" />
          <View style={{ flexDirection: "row", gap: padding }}>
            <IconButton icon="add" onPress={() => router.push("/add-post")} />
            <IconButton icon="menu" onPress={() => router.push("/settings")} />
          </View>
        </View>
      </Header>
      <ProfileHeader
        user={currentUser}
        currentUserId={currentUser.id}
        scrollY={scrollY}
        getHeight={(h) => setProfileHeaderHeight(h)}
        navItems={appConfig.profileNavItems}
      />
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          backgroundColor: background,
          paddingTop: profileHeaderHeight,
          minHeight: Dimensions.get("screen").height + profileHeaderHeight,
        }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
