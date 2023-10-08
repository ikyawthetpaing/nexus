import { Follow } from "@/types";

import { Button, ButtonProps } from "@/components/ui/button";
import { useUserFollowedSnapshot } from "@/hooks/snapshots";
import { toggleFollow } from "@/firebase/db";

interface Props extends ButtonProps {
  follow: Follow;
}

export function FollowButton({ follow, ...props }: Props) {
  const { followed } = useUserFollowedSnapshot(follow);

  return (
    <Button
      variant={followed ? "outline" : "default"}
      onPress={() => toggleFollow(follow)}
      {...props}
    >
      {followed ? "Following" : "Follow"}
    </Button>
  );
}
