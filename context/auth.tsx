import React, { createContext, useContext, useEffect, useState } from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";

import LoadingScreen from "@/components/loading";
import { FIREBASE_AUTH } from "@/firebase/config";

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook to handle protected routes
function useProtectedRoute(user: User | null) {
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
  const [user, setUser] = useState<User | null>(null);
  const [authInitializing, setAuthInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (_user) => {
      setUser(_user);
      setAuthInitializing(false); // Mark authentication as initialized
    });

    return () => unsubscribe(); // Unsubscribe from Firebase auth changes on unmount
  }, []);

  // Use the useProtectedRoute hook to handle protected routes, but only when auth is not initializing
  useProtectedRoute(authInitializing ? null : user);

  const authContext: AuthContextType = {
    user: user,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {authInitializing ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
