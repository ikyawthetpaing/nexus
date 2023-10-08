import React, { useState } from "react";
import { Follow, NavItem, User } from "@/types";
import { router, usePathname } from "expo-router";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Pressable,
  ViewProps,
} from "react-native";

import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/follow-button";
import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { Icons } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { getStyles } from "@/constants/style";
import { useTheme } from "@/context/theme";

const PROFILE_NAVBAR_HEIGHT = 50;

interface ProfileHeaderProps extends ViewProps {
  user: User;
  currentUser: User;
  scrollY: Animated.Value;
  getHeight?: (h: number) => void;
  navItems: NavItem[];
}

export function ProfileHeader({
  user,
  currentUser,
  scrollY,
  getHeight,
  navItems,
}: ProfileHeaderProps) {
  const isCurrentUser = user.id === currentUser.id;
  const follow: Follow = { followerId: currentUser.id, followingId: user.id };

  const { background, mutedForeground, accent, border } = useTheme();
  const { padding, borderWidthSmall: borderWidth } = getStyles();

  const pathname = usePathname();
  const [headerHeight, setHeaderHeight] = useState(0);

  const diffClampScrollY = Animated.diffClamp(scrollY, 0, headerHeight);
  const headerY = diffClampScrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight + STATUSBAR_HEIGHT + PROFILE_NAVBAR_HEIGHT],
    extrapolate: "clamp",
  });

  function onLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
    if (getHeight) {
      getHeight(height);
    }
  }

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        zIndex: 10,
        elevation: 1000,
        transform: [{ translateY: headerY }],
        borderBottomWidth: borderWidth,
        borderBottomColor: border,
        backgroundColor: background,
        paddingTop: HEADER_HEIGHT,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: padding,
          gap: padding,
        }}
      >
        <View style={{ gap: padding, flex: 1 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {user.name}
            </Text>
            <Text style={{ color: mutedForeground }}>@{user.username}</Text>
          </View>
          {user.bio && <Text>{user.bio}</Text>}
          <View style={{ flexDirection: "row", gap: padding }}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text style={{ fontWeight: "bold" }}>155k</Text>
              <Text style={{ color: mutedForeground }}>Followers</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text style={{ fontWeight: "bold" }}>45</Text>
              <Text style={{ color: mutedForeground }}>Following</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: accent,
            // overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {user.avatar && (
            <Image
              source={{ uri: user.avatar.uri }}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 9999,
              }}
            />
          )}
          {user.verified && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 10,
                borderRadius: 9999,
              }}
            >
              <Icons.verified size={24} color="#60a5fa" />
            </View>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: padding, padding: padding }}>
        {isCurrentUser ? (
          <>
            <Button
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => router.push("/edit-profile")}
            >
              Edit profile
            </Button>
            <Button variant="outline" size="sm" style={{ flex: 1 }}>
              Share profile
            </Button>
          </>
        ) : (
          <>
            <FollowButton size="sm" style={{ flex: 1 }} follow={follow} />
            <Button
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => router.push(`/(base)/(modal)/chat/${user.id}`)}
            >
              Message
            </Button>
          </>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {navItems.map((navItem, index) => {
          const baseSlug = isCurrentUser ? "/profile" : `/user/${user.id}`;
          const href = `${baseSlug}${navItem.slug ? `/${navItem.slug}` : ""}`;

          const isActive = pathname === href;

          return (
            <Pressable
              key={index}
              onPress={() => router.push(href)}
              style={{
                flex: 1,
              }}
            >
              {({ pressed }) => (
                <View
                  style={[
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      height: PROFILE_NAVBAR_HEIGHT,
                      backgroundColor: pressed ? accent : "transparent",
                      borderBottomWidth: isActive ? 1 : 0,
                      borderBottomColor: isActive ? "black" : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontWeight: "500",
                        fontSize: 16,
                      },
                      !isActive && { color: mutedForeground },
                    ]}
                  >
                    {navItem.title}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
