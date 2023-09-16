import { AppConfig } from "@/types";

export const appConfig: AppConfig = {
  name: "Nexus",
  url: "https://www.nexus.net",
  authors: [{ name: "Kyaw Thet Paing", url: "https://www.ikyawthetpaing.com" }],
  creator: "@ikyawthetpaing",
  profileNavItems: [
    { title: "Posts", slug: "/profile" },
    { title: "Replies", slug: "/profile/replies" },
    { title: "Reposts", slug: "/profile/reposts" },
  ],
  tabBarNavItems: [
    { icon: "home", slug: "/" },
    { icon: "search", slug: "/search" },
    { icon: "add", slug: "/add-post" },
    { icon: "mail", slug: "/message" },
    { icon: "profile", slug: "/profile" },
  ],
};
