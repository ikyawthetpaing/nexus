import { router } from "expo-router";
import { Pressable } from "react-native";

import { useCurrentUser } from "@/context/current-user";

interface Props {
  userId: string;
  children: React.ReactNode;
}

export function UserLink({ userId, children }: Props) {
  const { user } = useCurrentUser();
  const isCurrentUser = user?.id === userId;

  return (
    <Pressable
      onPress={() => {
        if (isCurrentUser) {
          router.push("/(base)/(main)/profile");
        } else {
          router.push({
            pathname: "/(base)/(modal)/user/[id]/",
            params: { id: userId },
          });
        }
      }}
    >
      {children}
    </Pressable>
  );
}
