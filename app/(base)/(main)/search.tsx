import { useEffect, useRef, useState } from "react";
import { User } from "@/types";
import { Pressable, TextInput } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import { AvatarImage } from "@/components/ui/avatar-image";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { FollowButton } from "@/components/follow-button";
import { HEADER_HEIGHT } from "@/components/header";
import { Icons } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { UserLink } from "@/components/user-link";
import { ScrollViewWithHeader } from "@/components/view-with-header";
import { getStyles } from "@/constants/style";
import { useDebounce } from "@/hooks/use-debounce";
import { useCurrentUser } from "@/context/current-user";
import { useTheme } from "@/context/theme";
import { getUser, searchUsers } from "@/firebase/firestore";

export default function SearchScreen() {
  const { user: currentUser } = useCurrentUser();
  const { accent, foreground, mutedForeground } = useTheme();
  const { padding } = getStyles();
  const inputRef = useRef<TextInput | null>(null);

  // const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 750);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const featuredUserIds = [
    "VqRdU6ghh0TGZYVhCvcqXfbU1Gu1",
    "zoFQxlY2WDUqNoJ60Wq6uXeMpO93",
  ];

  useEffect(() => {
    const _users: User[] = [];
    featuredUserIds.map(async (userId) => {
      const _user = await getUser(userId);
      if (_user) {
        _users.push(_user);
      }
    });
    setFeaturedUsers(_users);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (debouncedQuery) {
        const res = await searchUsers(debouncedQuery, currentUser.id);
        setSearchedUsers(res);
      }
      setLoading(false);
    };
    fetch();
  }, [debouncedQuery]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollViewWithHeader
        headerChildren={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: padding,
              position: "relative",
              gap: padding,
            }}
          >
            <IconButton
              icon="arrowLeft"
              style={{
                justifyContent: "center",
                display: searching ? "flex" : "none",
              }}
              onPress={() => {
                inputRef.current?.blur();
                setSearching(false);
                setQuery("");
                setSearchedUsers([]);
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Pressable
                style={{ zIndex: 10, position: "absolute", left: padding }}
              >
                <Icons.search size={18} color={foreground} />
              </Pressable>
              <Input
                ref={inputRef}
                placeholder="Search"
                placeholderTextColor={mutedForeground}
                onFocus={() => setSearching(true)}
                inputMode="search"
                value={query}
                onChangeText={(text) => setQuery(text)}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  position: "absolute",
                  backgroundColor: accent,
                  left: 0,
                  right: 0,
                  borderRadius: 10,
                  padding: 0,
                  paddingLeft: padding * 3.5,
                  paddingRight: padding,
                  height: "100%",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              />
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            // onRefresh={() => setRefresh(true)}
            progressViewOffset={HEADER_HEIGHT}
          />
        }
      >
        <View style={{ display: searching ? "none" : "flex" }}>
          {featuredUsers.map((user, index) => (
            <SearchUserItem
              key={index}
              user={user}
              currentUserId={currentUser.id}
            />
          ))}
        </View>
        <View style={{ display: searching ? "flex" : "none" }}>
          {searchedUsers.length > 0 ? (
            searchedUsers.map((user, index) => (
              <SearchUserItem
                key={index}
                user={user}
                currentUserId={currentUser.id}
              />
            ))
          ) : (
            <View style={{ alignItems: "center", padding: padding }}>
              <Text
                style={{
                  color: mutedForeground,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                No results found for "{query}"
              </Text>
            </View>
          )}
        </View>
      </ScrollViewWithHeader>
    </View>
  );
}

interface SearchUserItemProps {
  currentUserId: string;
  user: User;
}

function SearchUserItem({ user, currentUserId }: SearchUserItemProps) {
  const { avatarSizeSm, padding, borderWidthSmall } = getStyles();
  const { border, mutedForeground } = useTheme();
  if (!user) {
    return null;
  }

  return (
    <UserLink userId={user.id}>
      <View
        style={{
          padding: padding,
          borderBottomWidth: borderWidthSmall,
          borderBottomColor: border,
          flexDirection: "row",
          gap: padding,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: padding }}>
          <AvatarImage uri={user.avatar?.uri} style={{ width: avatarSizeSm }} />
          <View>
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                {user.name}
              </Text>
              {user.verified && <Icons.verified size={16} color="#60a5fa" />}
            </View>
            <Text style={{ color: mutedForeground }}>@{user.username}</Text>
          </View>
        </View>
        <FollowButton
          size="sm"
          follow={{ followerId: currentUserId, followingId: user.id }}
          style={{ justifyContent: "center" }}
        />
      </View>
    </UserLink>
  );
}
