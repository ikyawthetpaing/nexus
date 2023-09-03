import { NavItem } from "@/types";

export const profileConfig = {
  navItems: [
    { title: "Posts", slug: "/profile" },
    { title: "Replies", slug: "/profile/replies" },
    { title: "Reposts", slug: "/profile/reposts" },
  ] as NavItem[],
};
