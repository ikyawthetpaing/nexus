import * as RN from "react-native";

import { useThemedColors } from "@/constants/colors";

export function Text({ style, ...props }: RN.TextProps) {
  const { foreground } = useThemedColors();
  return <RN.Text style={[{ color: foreground }, style]} {...props} />;
}

export function View({ style, ...props }: RN.ViewProps) {
  const { background } = useThemedColors();
  return (
    <RN.View style={[{ backgroundColor: background }, style]} {...props} />
  );
}

export function TextInput({ style, ...props }: RN.TextInputProps) {
  const { foreground } = useThemedColors();
  return <RN.TextInput style={[{ color: foreground }, style]} {...props} />;
}
