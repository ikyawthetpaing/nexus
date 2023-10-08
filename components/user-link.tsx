import { Link } from "expo-router";

import { useCurrentUser } from "@/context/current-user";

interface Props {
  userId: string;
  children: React.ReactNode;
}

export function UserLink({ userId, children }: Props) {
  const { user } = useCurrentUser();
  const isCurrentUser = user?.id === userId;

  return (
    <Link
      href={
        isCurrentUser
          ? {
              pathname: "/(base)/(main)/profile/",
            }
          : {
              pathname: "/(base)/(modal)/user/[id]/",
              params: { id: userId },
            }
      }
    >
      {children}
    </Link>
  );
}
