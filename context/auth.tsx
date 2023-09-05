import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as AuthUser } from "firebase/auth";
import { useRootNavigationState, useSegments, router } from "expo-router";
import LoadingScreen from "@/components/loading";
import { FIREBASE_AUTH } from "@/firebase/config";

interface AuthContextType {
  authUser: AuthUser | null;
}

const AuthContext = createContext<AuthContextType>({ authUser: null });

export function useAuth() {
  return useContext(AuthContext);
}

// Custom hook to handle protected routes
function useProtectedRoute(user: AuthUser | null) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (!navigationState?.key) return;

    // Calculate the desired redirect state without causing state updates
    let newShouldRedirect = false;

    if (!user && !inAuthGroup) {
      newShouldRedirect = true;
    } else if (user && !inAuthGroup && !user.emailVerified) {
      newShouldRedirect = true;
    } else if (user && inAuthGroup) {
      newShouldRedirect = true;
    }

    // Only update the state if there's a change to avoid infinite loops
    if (newShouldRedirect !== shouldRedirect) {
      setShouldRedirect(newShouldRedirect);
    }

    console.log("run: [user, segments, navigationState, shouldRedirect]");
  }, [user, segments, navigationState, shouldRedirect]);

  useEffect(() => {
    if (shouldRedirect) {
      if (!user) {
        router.replace("/signin");
      } else if (user && !user.emailVerified) {
        router.replace("/signup");
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }
    console.log("run: [shouldRedirect, user]");
  }, [shouldRedirect, user]);

  return shouldRedirect;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authInitializing, setAuthInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (_user) => {
      setAuthUser(_user);
      setAuthInitializing(false); // Mark authentication as initialized
    });

    return () => unsubscribe(); // Unsubscribe from Firebase auth changes on unmount
  }, []);

  // Use the useProtectedRoute hook to handle protected routes, but only when auth is not initializing
  useProtectedRoute(authInitializing ? null : authUser);

  const authContext: AuthContextType = {
    authUser,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {authInitializing ? (
        <LoadingScreen />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}