import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { forwardRef } from "react";

type Variant = "default" | "underline";

interface Props extends TextInputProps {
  variant?: Variant;
}

export const Input = forwardRef<TextInput, Props>(
  ({ style, variant = "default", ...props }, ref) => {
    const {mutedForeground} = getThemedColors();
    const { padding } = getStyles();

    const themedStyles = getThemedStyles({ variant });
    return (
      <TextInput
        ref={ref}
        style={[
          themedStyles,
          props.multiline && {
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

const getThemedStyles = ({ variant }: { variant: Variant }) => {
  const { foreground, accent, background, border } = getThemedColors();
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
  });

  const variantStyles =
    variant === "default"
      ? styles.default
      : variant === "underline"
      ? styles.underline
      : {};

  const themedStyles = { ...styles.common, ...variantStyles };
  return themedStyles;
};
