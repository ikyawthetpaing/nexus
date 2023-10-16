import { useEffect, useState } from "react";
import { router } from "expo-router";
import { sendEmailVerification, updateEmail } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { Spinner } from "@/components/spinner";
import { Text, View } from "@/components/themed";
import { getStyles } from "@/constants/style";
import { useAlert } from "@/context/alert";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/context/theme";
import { handleFirebaseError } from "@/firebase/error-handler";
import { isValidEmail } from "@/lib/utils";

export default function VerifyEmailScreen() {
  const { mutedForeground } = useTheme();
  const { padding } = getStyles();

  const { user } = useAuth();
  if (!user) {
    router.replace("/signup");
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setAlert } = useAlert();

  useEffect(() => {
    setEmail(user?.email || "");
  }, [user]);

  function onPressBack() {
    router.push("/signin");
  }

  async function onPressSubmit() {
    setLoading(true);
    try {
      if (!isValidEmail(email)) {
        setErrorMessage("Must be a valid email address.");
        return;
      }

      if (user) {
        if (email !== user.email) {
          await updateEmail(user, email);
        }
        await sendEmailVerification(user);
        setAlert({
          title: "Verify Email",
          description: `Verification email sent to ${user.email}.`,
          button: [
            {
              text: "Ok",
              action: () => setAlert(null),
            },
          ],
        });
      }
    } catch (err) {
      handleFirebaseError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: STATUSBAR_HEIGHT, flex: 1 }}>
        <View style={{ padding: padding }}>
          <IconButton icon="arrowLeft" onPress={onPressBack} />
        </View>
        <View style={{ justifyContent: "space-between", flex: 1 }}>
          <View style={{ paddingHorizontal: padding, gap: padding * 1.75 }}>
            <View style={{ gap: padding }}>
              <Text style={{ fontSize: 24, fontWeight: "500" }}>
                Verify your email
              </Text>
              <Text style={{ color: mutedForeground }}>
                Enter the email where you can be contacted. No one will see this
                on your profile.
              </Text>
            </View>
            <View style={{ gap: padding }}>
              <Input
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              {errorMessage && (
                <Text style={{ color: "red" }}>{errorMessage}</Text>
              )}
            </View>
            <Button onPress={onPressSubmit} disabled={loading}>
              {loading ? <Spinner /> : "Verify"}
            </Button>
          </View>
          <View style={{ alignItems: "center", padding: padding * 2 }}>
            <Button
              variant="ghost"
              size="sm"
              onPress={() =>
                setAlert({
                  title: "Already have an account?",
                  button: [
                    {
                      text: "Continue Sign Up",
                      action: () => setAlert(null),
                    },
                    {
                      text: "Login",
                      action: () => router.push("/signin"),
                    },
                  ],
                })
              }
            >
              Already have an account?
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
