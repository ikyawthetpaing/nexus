import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/edit-screen-info";
import { Text, View } from "@/components/themed";

export default function ProfileRepostsScreen() {
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
