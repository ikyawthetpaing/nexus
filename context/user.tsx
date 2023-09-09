import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import LoadingScreen from "@/components/loading";
import { FIREBASE_AUTH } from "@/firebase/config";
import { Post, User } from "@/types";
import { getUserPosts, getUserProfile } from "@/firebase/database";

interface UserContextType {
  user: User | null;
  posts: Post[];
  loading: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  posts: [],
  loading: false,
  setRefresh: () => {},
});

export function useCurrentUser() {
  return useContext(UserContext);
}

interface Props {
  children: React.ReactNode;
}

export function UserContextProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refresh, setRefresh] = useState(true);

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const authUser = FIREBASE_AUTH.currentUser;

      if (authUser) {
        const userProfile = await getUserProfile(authUser.uid)
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

  const userContext: UserContextType = {
    user,
    posts,
    loading,
    setRefresh,
  };

  return (
    <UserContext.Provider value={userContext}>
      {initializing ? <LoadingScreen /> : children}
    </UserContext.Provider>
  );
}
