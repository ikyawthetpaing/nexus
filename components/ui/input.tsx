import { forwardRef } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { getStyles } from "@/constants/style";
import { useTheme } from "@/context/theme";

type Variant = "default" | "underline" | "ghost";

export interface InputProps extends TextInputProps {
  variant?: Variant;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ style, variant = "default", ...props }, ref) => {
    const { mutedForeground } = useTheme();
    const { padding } = getStyles();

    const themedStyles = useThemedStyles({ variant });
    return (
      <TextInput
        ref={ref}
        style={[
          themedStyles,
          props.multiline &&
            variant === "underline" && {
              textAlignVertical: "top",
              paddingTop: padding / 2,
            },
          style,
        ]}
        placeholderTextColor={mutedForeground}
        {...props}
      />
    );
  }
);

const useThemedStyles = ({ variant }: { variant: Variant }) => {
  const { foreground, accent, background, border } = useTheme();
  const { padding } = getStyles();

  const styles = StyleSheet.create({
    common: {
      backgroundColor: background,
      color: foreground,
      fontSize: 16,
    },
    default: {
      backgroundColor: accent,
      height: 58,
      borderRadius: 10,
      padding: padding,
    },
    underline: {
      borderBottomWidth: 1,
      borderBottomColor: border,
      paddingBottom: padding / 2,
    },
    ghost: {},
  });

  const variantStyles =
    variant === "default"
      ? styles.default
      : variant === "underline"
      ? styles.underline
      : variant === "ghost"
      ? styles.ghost
      : {};

  const themedStyles = { ...styles.common, ...variantStyles };
  return themedStyles;
};
