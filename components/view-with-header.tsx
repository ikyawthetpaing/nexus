import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from "react-native";
import { HEADER_HEIGHT, Header } from "@/components/header";

interface ScrollViewWithHeaderProps extends ScrollViewProps {
  headerChildren: React.ReactNode;
  children: React.ReactNode;
}

export function ScrollViewWithHeader({
  headerChildren,
  children,
  contentContainerStyle,
  ...props
}: ScrollViewWithHeaderProps) {
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
        contentContainerStyle={[
          {
            paddingTop: HEADER_HEIGHT,
          },
          contentContainerStyle,
        ]}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </>
  );
}
