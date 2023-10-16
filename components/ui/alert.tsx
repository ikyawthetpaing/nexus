import { StatusBar } from "expo-status-bar";
import {
  Modal,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
} from "react-native";

import { Text, View } from "@/components/themed";
import { getStyles } from "@/constants/style";
import { useTheme } from "@/context/theme";

interface AlertProps {
  visible?: boolean;
  children: React.ReactNode;
}

function Alert({ children, visible }: AlertProps) {
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

interface AlertTitleProps {
  children: React.ReactNode;
}

function AlertTitle({ children }: AlertTitleProps) {
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

interface AlertDescriptionProps {
  children: React.ReactNode;
}

function AlertDescription({ children }: AlertDescriptionProps) {
  const { mutedForeground } = useTheme();
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

interface AlertFooterProps {
  children: React.ReactNode;
}

function AlertFooter({ children }: AlertFooterProps) {
  return <View style={{ marginTop: 32 }}>{children}</View>;
}

interface AlertFooterButtonProps extends PressableProps {
  children: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
}

function AlertFooterButton({
  children,
  textStyle,
  ...props
}: AlertFooterButtonProps) {
  const { border, accent } = useTheme();
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

export { Alert, AlertTitle, AlertDescription, AlertFooter, AlertFooterButton };
