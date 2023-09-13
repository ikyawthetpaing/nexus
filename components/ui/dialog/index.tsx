import { StatusBar } from "expo-status-bar";
import {
  Modal,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
} from "react-native";

import { Text, View } from "@/components/themed";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";

interface DialogProps {
  visible: boolean;
  children: React.ReactNode;
}

export function Dialog({ children, visible }: DialogProps) {
  return (
    <Modal transparent visible={visible}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderRadius: 18,
            width: 256,
            overflow: "hidden",
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 32,
        textAlign: "center",
      }}
    >
      {children}
    </Text>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  const { mutedForeground } = getThemedColors();
  return (
    <Text
      style={{
        color: mutedForeground,
        marginTop: 10,
        textAlign: "center",
        paddingHorizontal: 32,
      }}
    >
      {children}
    </Text>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return <View style={{ marginTop: 32 }}>{children}</View>;
}

interface DialogFooterButtonProps extends PressableProps {
  children: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
}

export function DialogFooterButton({
  children,
  textStyle,
  ...props
}: DialogFooterButtonProps) {
  const { border, accent } = getThemedColors();
  const { borderWidthSmall } = getStyles();

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View
          style={[
            {
              paddingVertical: 12,
              borderTopWidth: borderWidthSmall,
              borderTopColor: border,
              alignItems: "center",
            },
            pressed && { backgroundColor: accent },
          ]}
        >
          <Text style={[{ fontSize: 16 }, textStyle]}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
}
