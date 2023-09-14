import { Link } from "expo-router";

interface Props {
  userId: string;
  children: React.ReactNode;
}

export function UserLink({ userId, children }: Props) {
  return (
    <Link
      href={{
        pathname: "/(base)/(modal)/user/[id]/",
        params: { id: userId },
      }}
    >
      {children}
    </Link>
  );
}
