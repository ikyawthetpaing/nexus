import { Stack } from "expo-router";

import { CurrentUserContextProvider } from "@/context/current-user";
import { FeedContextProvider } from "@/context/feed";
import { UploaderContextProvider } from "@/context/uploader";

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
