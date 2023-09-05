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
import { User } from "@/types";
import { getUserProfile } from "@/firebase/database";

interface UserContextType {
  user: User | null;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
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
  const [refresh, setRefresh] = useState(true);

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const run = async () => {
      const authUser = FIREBASE_AUTH.currentUser;
      setUser(
        authUser && authUser.email ? await getUserProfile(authUser.uid) : null
      );
      setInitializing(false);
    };
    if (refresh) {
      run();
      setRefresh(false);
    }
  }, [refresh]);

  const userContext: UserContextType = {
    user,
    setRefresh,
  };

  return (
    <UserContext.Provider value={userContext}>
      {initializing ? <LoadingScreen /> : children}
    </UserContext.Provider>
  );
}
