import { StyleSheet } from "react-native";

import { Text, View } from "@/components/themed";
import EditScreenInfo from "@/components/edit-screen-info";

export default function ProfileRepostsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reposts</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/(tabs)/profile/reposts.tsx" />
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
