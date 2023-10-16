import { Text, View } from "@/components/themed";
import { useTheme } from "@/context/theme";

export default function UserProfileRepliesScreen() {
  const { mutedForeground } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          marginTop: 64,
          textAlign: "center",
          fontSize: 16,
          color: mutedForeground,
        }}
      >
        No replies yet
      </Text>
    </View>
  );
}
