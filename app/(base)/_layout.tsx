import { UserContextProvider } from "@/context/user";
import { Stack } from "expo-router";

export default function BaseLayout() {
  return (
    <UserContextProvider>
      <Stack screenOptions={{ headerShown: false }}/>
    </UserContextProvider>
  );
}
