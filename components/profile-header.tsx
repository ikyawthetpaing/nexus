import {
  Animated,
  Image,
  LayoutChangeEvent,
  Pressable,
  ViewProps,
} from "react-native";

import { HEADER_HEIGHT, STATUSBAR_HEIGHT } from "@/components/header";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Text, View } from "@/components/themed";
import { router, usePathname } from "expo-router";
import { profileConfig } from "@/config/profile";
import React, { useState } from "react";
import { User } from "@/types";
import { Button } from "./ui/button";

const PROFILE_NAVBAR_HEIGHT = 50;

interface ProfileHeaderProps extends ViewProps {
  user: User;
  scrollY: Animated.Value;
  getHeight?: (h: number) => void;
}

export function ProfileHeader({
  user,
  scrollY,
  getHeight,
}: ProfileHeaderProps) {
  const { background, mutedForeground, accent, border } = getThemedColors();
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
          gap: padding
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
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              }}
            />
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: padding, padding: padding }}>
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
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {profileConfig.navItems.map((navItem, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(navItem.slug)}
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
                  },
                  pressed && { backgroundColor: accent },
                  pathname === navItem.slug && {
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      fontWeight: "500",
                      fontSize: 16,
                    },
                    pathname !== navItem.slug && { color: mutedForeground },
                  ]}
                >
                  {navItem.title}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}
