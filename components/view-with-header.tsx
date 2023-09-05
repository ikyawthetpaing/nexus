import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

import { HEADER_HEIGHT, Header } from "@/components/header";
import { View } from "@/components/themed";

interface ViewWithHeaderProps {
  headerChildren: React.ReactNode;
  children: React.ReactNode;
}

export function ViewWithHeader({
  headerChildren,
  children,
}: ViewWithHeaderProps) {
  const scrollY = new Animated.Value(0);

  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <>
      <Header scrollY={scrollY}>{headerChildren}</Header>
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ marginTop: HEADER_HEIGHT }}>{children}</View>
      </Animated.ScrollView>
    </>
  );
}
