import { Tabs } from "expo-router";

import { Icons } from "@/components/icons";
import { useThemedColors } from "@/constants/colors";

export default function TabLayout() {
  const { primary, background, border } = useThemedColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: background,
          borderColor: border,
          elevation: 1000,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icons.home color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Icons.search color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ color, focused }) => (
            <Icons.mail color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Icons.profile color={color} filled={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
