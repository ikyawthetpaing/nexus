import { FeedContextProvider } from "@/context/feed";
import { UserContextProvider } from "@/context/user";
import { Stack } from "expo-router";

export default function BaseLayout() {
  return (
    <UserContextProvider>
      <FeedContextProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FeedContextProvider>
    </UserContextProvider>
  );
}
