import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { HEADER_HEIGHT, Header } from "@/components/header";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { View } from "@/components/themed";
import { Slot, router } from "expo-router";
import { useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { IconButton } from "@/components/ui/icon-button";
import { useCurrentUser } from "@/context/current-user";

export default function ProfileLayout() {
  const { user, loading, setRefresh } = useCurrentUser();

  if (!user) {
    return null;
  }

  const { background } = getThemedColors();
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
            <IconButton icon="add" onPress={() => router.push("/post")} />
            <IconButton icon="menu" onPress={() => router.push("/settings")} />
          </View>
        </View>
      </Header>
      <ProfileHeader
        user={user}
        scrollY={scrollY}
        getHeight={(h) => setProfileHeaderHeight(h)}
      />
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          backgroundColor: background,
          paddingTop: profileHeaderHeight,
          minHeight: Dimensions.get("screen").height + profileHeaderHeight
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(true)}
            progressViewOffset={profileHeaderHeight}
          />
        }
      >
          <Slot />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
