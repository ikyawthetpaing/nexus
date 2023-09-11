import { CurrentUserContextProvider } from "@/context/current-user";
import { FeedContextProvider } from "@/context/feed";
import { UploaderContextProvider } from "@/context/uploader";
import { Stack } from "expo-router";

export default function BaseLayout() {
  return (
    <CurrentUserContextProvider>
      <FeedContextProvider>
        <UploaderContextProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </UploaderContextProvider>
      </FeedContextProvider>
    </CurrentUserContextProvider>
  );
}
