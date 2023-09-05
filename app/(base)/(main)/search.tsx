import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { HEADER_HEIGHT, Header } from "@/components/header";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Text, TextInput, View } from "@/components/themed";
import { Icons } from "@/components/icons";

export default function TabTwoScreen() {
  const { background, accent, foreground } = getThemedColors();
  const { padding, borderRadius: radius } = getStyles();

  const scrollY = new Animated.Value(0);

  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={background} />
      <Header scrollY={scrollY}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            padding: padding
          }}
        >
          <Pressable style={{zIndex: 10, position: "absolute", left: padding * 2}}>
          <Icons.search size={18} color={foreground}/>
          </Pressable>
          <TextInput
            placeholder="Search"
            style={{
              backgroundColor: accent,
              top: padding,
              left: padding,
              right: padding,
              bottom: padding,
              position: "absolute",
              borderRadius: radius,
              paddingLeft: padding * 4
            }}
          />
        </View>
      </Header>
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{
          paddingTop: HEADER_HEIGHT,
        }}
      >
        <View style={{flex: 1, width: "100%", height: "100%"}}>
          <Text>Search</Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
