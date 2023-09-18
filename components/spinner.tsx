import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

import { useTheme } from "@/context/theme";

interface Props extends ActivityIndicatorProps {}

export function Spinner({ ...props }: Props) {
  const { foreground } = useTheme();
  return <ActivityIndicator color={foreground} {...props} />;
}
