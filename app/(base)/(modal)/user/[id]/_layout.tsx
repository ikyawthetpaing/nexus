import React, { useState } from "react";
import { router, Slot, useLocalSearchParams } from "expo-router";
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
import { LoadingScreen } from "@/components/loading-screen";
import { ProfileHeader } from "@/components/profile-header";
import { View } from "@/components/themed";
import { appConfig } from "@/config/app";
import { getStyles } from "@/constants/style";
import { useUserSnapshot } from "@/hooks/snapshots";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";

export default function ProfileLayout() {
  const { id } = useLocalSearchParams();

  const userId = typeof id === "string" ? id : "";

  const { background } = useTheme();
  const { padding } = getStyles();
  const { user } = useUserSnapshot(userId);
  const { user: currentUser } = useCurrentUser();

  const [profileHeaderHeight, setProfileHeaderHeight] = useState(0);
  const scrollY = new Animated.Value(0);
  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  if (!currentUser) {
    return router.replace("/(auth)/signin");
  }

  if (!user) {
    return <LoadingScreen />;
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
          <IconButton icon="arrowLeft" onPress={() => router.back()} />
          <IconButton icon="menu" onPress={() => router.push("/settings")} />
        </View>
      </Header>
      <ProfileHeader
        user={user}
        currentUser={currentUser}
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
        <Slot />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
