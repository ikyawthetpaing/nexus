import * as RN from "react-native";

import { useTheme } from "@/context/theme";

export function Text({ style, ...props }: RN.TextProps) {
  const { foreground } = useTheme();
  return <RN.Text style={[{ color: foreground }, style]} {...props} />;
}

export function View({ style, ...props }: RN.ViewProps) {
  const { background } = useTheme();
  return (
    <RN.View style={[{ backgroundColor: background }, style]} {...props} />
  );
}

export function TextInput({ style, ...props }: RN.TextInputProps) {
  const { foreground } = useTheme();
  return <RN.TextInput style={[{ color: foreground }, style]} {...props} />;
}
