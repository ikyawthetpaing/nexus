import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Post, User } from "@/types";

import LoadingScreen from "@/components/loading";
import { FIREBASE_AUTH } from "@/firebase/config";
import { getUser, getUserPosts } from "@/firebase/database";

interface CurrentUserContextType {
  user: User | null;
  posts: Post[];
  loading: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      "useCurrentUser must be used within an CurrentUserContextProvider"
    );
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function CurrentUserContextProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refresh, setRefresh] = useState(true);

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const authUser = FIREBASE_AUTH.currentUser;

      if (authUser) {
        const userProfile = await getUser(authUser.uid);
        const userPosts = await getUserPosts(authUser.uid);

        setUser(userProfile);
        setPosts(userPosts);
      }
      setInitializing(false);
    };
    if (refresh) {
      setLoading(true);
      console.log("fetch user data");
      fetchData();
      setRefresh(false);
      setLoading(false);
    }
  }, [refresh]);

  const userContext: CurrentUserContextType = {
    user,
    posts,
    loading,
    setRefresh,
  };

  return (
    <CurrentUserContext.Provider value={userContext}>
      {initializing ? <LoadingScreen /> : children}
    </CurrentUserContext.Provider>
  );
}
