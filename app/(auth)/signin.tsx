import { useState } from "react";
import { Icons } from "@/components/icons";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Link, router } from "expo-router";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { View } from "@/components/themed";
import { handleFirebaseError } from "@/firebase/error-handler";
import { signIn } from "@/firebase/authentication";

export default function LoginPage() {
  const { foreground } = getThemedColors();
  const { padding } = getStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      await signIn(
        email,
        password
      );
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
        <Icons.LogoIcon size={128} color={foreground} />
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