import React from "react";

import { Spinner } from "@/components/spinner";
import { View } from "@/components/themed";

export const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner size="large" />
    </View>
  );
};
