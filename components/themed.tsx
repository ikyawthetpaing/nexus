import * as RN from "react-native";

import { getThemedColors } from "@/constants/colors";

export function Text({ style, ...props }: RN.TextProps) {
  const { foreground } = getThemedColors();
  return <RN.Text style={[{ color: foreground }, style]} {...props} />;
}

export function View({ style, ...props }: RN.ViewProps) {
  const { background } = getThemedColors();
  return (
    <RN.View style={[{ backgroundColor: background }, style]} {...props} />
  );
}

export function TextInput({ style, ...props }: RN.TextInputProps) {
  const { foreground } = getThemedColors();
  return <RN.TextInput style={[{ color: foreground }, style]} {...props} />;
}
