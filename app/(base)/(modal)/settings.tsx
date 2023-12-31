import { useState } from "react";
import { signOut } from "firebase/auth";
import { StyleSheet } from "react-native";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { View } from "@/components/themed";
import { FIREBASE_AUTH } from "@/firebase/config";

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);
  async function onPressSignOut() {
    setLoading(true);
    await signOut(FIREBASE_AUTH);
    setLoading(false);
  }
  return (
    <View style={styles.container}>
      <Button onPress={onPressSignOut}>
        {loading ? <Spinner /> : "Sign out"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
