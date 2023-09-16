import { useState } from "react";
import { Link, router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/spinner";
import { View } from "@/components/themed";
import { useThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { signIn } from "@/firebase/authentication";
import { handleFirebaseError } from "@/firebase/error-handler";

export default function SignInScreen() {
  const { foreground } = useThemedColors();
  const { padding } = getStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingVertical: 80,
          marginTop: STATUSBAR_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icons.LogoIcon size={96} color={foreground} />
      </View>
      <View
        style={{
          flex: 1,
          padding: padding,
          paddingTop: 0,
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 20 }}>
          <Input
            placeholder="Enter email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Enter password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button onPress={handleLogin} disabled={loading}>
            {loading ? <Spinner /> : "Login"}
          </Button>
          <View style={{ alignItems: "center" }}>
            <Link href={"/"} style={{ color: foreground }}>
              Forgot password?
            </Link>
          </View>
        </View>
        <View>
          <Button
            variant="outline"
            onPress={() => router.push("/signup")}
            disabled={loading}
          >
            Create an account
          </Button>
        </View>
      </View>
    </View>
  );
}
