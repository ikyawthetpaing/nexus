import { useEffect, useState } from "react";
import { User } from "@/types";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { Pressable, StatusBar } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertFooter,
  AlertFooterButton,
  AlertTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { Icons } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { useThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { useAuth } from "@/context/auth";
import { FIREBASE_AUTH } from "@/firebase/config";
import { createUser } from "@/firebase/database";
import { handleFirebaseError } from "@/firebase/error-handler";
import { isValidEmail, isValidUsername } from "@/lib/utils";

interface FormStep {
  title: string;
  description?: string;
  validate: () => boolean;
  errorMessage: string;
  input: JSX.Element;
}

function Step({
  title,
  description,
  errorMessage,
  input,
  onPress,
}: {
  title: string;
  description: string | undefined;
  errorMessage: string | null;
  input: JSX.Element;
  onPress: () => void;
}) {
  const { mutedForeground } = useThemedColors();
  const { padding } = getStyles();
  return (
    <View style={{ paddingHorizontal: padding, gap: padding * 1.75 }}>
      <View style={{ gap: padding }}>
        <Text style={{ fontSize: 24, fontWeight: "500" }}>{title}</Text>
        {description && (
          <Text style={{ color: mutedForeground }}>{description}</Text>
        )}
      </View>
      <View style={{ gap: padding }}>
        {input}
        {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      </View>
      <Button onPress={onPress}>Next</Button>
    </View>
  );
}

export default function SignUpScreen() {
  const { user } = useAuth();
  const { background, foreground, mutedForeground } = useThemedColors();
  const { padding } = getStyles();

  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    title: string;
    description?: string;
    button: { text: string; action: () => void }[];
  } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    username: "",
    email: user?.email || "",
  });

  const formSteps: FormStep[] = [
    {
      title: "What's your name?",
      validate: () => formData.fullName.length >= 3,
      errorMessage: "Must be at least 3 letters.",
      input: (
        <Input
          placeholder="Name"
          autoCapitalize="words"
          autoFocus={true}
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
      ),
    },
    {
      title: "Create a password",
      description:
        "Create a password with a least 8 letters or numbers. It should be something others can't guess.",
      validate: () => formData.password.length >= 8,
      errorMessage: "Password must be at least 8 letters.",
      input: (
        <Input
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
      ),
    },
    {
      title: "Create a username",
      description:
        "Add a username or use or suggestion. You can change this at any time.",
      validate: () =>
        formData.username.length >= 3 && isValidUsername(formData.username),
      errorMessage: "Must be a valid username.",
      input: (
        <Input
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
      ),
    },
    {
      title: user ? "Verify your email" : "What's your email?",
      description:
        "Enter the email where you can be contacted. No one will see this on your profile.",
      validate: () => isValidEmail(formData.email),
      errorMessage: "Must be a valid email.",
      input: (
        <Input
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      ),
    },
  ];

  const [step, setStep] = useState(user ? formSteps.length - 1 : 0);

  useEffect(() => {
    setError(null);
  }, [step]);

  const onPressBack = () => {
    if (step === 0 || user) {
      router.push("/signin");
    } else {
      setStep(step - 1);
    }
  };

  async function verificationEmail(user: FirebaseUser) {
    try {
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
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  async function updateVerificationEmail(user: FirebaseUser, email: string) {
    try {
      await updateEmail(user, email);
      await verificationEmail(user);
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  const onPressNext = async () => {
    try {
      const currentFormStep = formSteps[step];
      if (currentFormStep.validate()) {
        if (step === formSteps.length - 1) {
          if (user) {
            if (formData.email !== user.email) {
              updateVerificationEmail(user, formData.email);
            } else {
              await verificationEmail(user);
            }
          } else {
            const userCredential = await createUserWithEmailAndPassword(
              FIREBASE_AUTH,
              formData.email,
              formData.password
            );

            const newUser = userCredential.user;

            // Update profile on firebase auth
            await updateProfile(newUser, {
              displayName: formData.fullName,
            });

            const createUserData: User = {
              id: newUser.uid,
              name: formData.fullName,
              username: formData.username,
              email: formData.email,
              verified: false,
              bio: null,
              avatar: null,
            };

            await createUser(createUserData, newUser.uid);
          }
        } else {
          setStep(step + 1);
        }
        setError(null);
      } else {
        setError(currentFormStep.errorMessage);
      }
    } catch (err) {
      handleFirebaseError(err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={background} />
      <View style={{ marginTop: STATUSBAR_HEIGHT, flex: 1 }}>
        <View style={{ padding: padding }}>
          <Pressable onPress={onPressBack}>
            {({ pressed }) => (
              <Icons.arrowLeft color={pressed ? foreground : mutedForeground} />
            )}
          </Pressable>
        </View>
        <View style={{ justifyContent: "space-between", flex: 1 }}>
          <Step
            title={formSteps[step].title}
            description={formSteps[step].description}
            errorMessage={error}
            input={formSteps[step].input}
            onPress={onPressNext}
          />
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
      <Alert visible={!!alert}>
        <AlertTitle>{alert?.title}</AlertTitle>
        {alert?.description && (
          <AlertDescription>{alert?.description}</AlertDescription>
        )}
        <AlertFooter>
          {alert?.button.map((btn, i) => (
            <AlertFooterButton
              key={i}
              textStyle={{ fontWeight: "500", color: "#60a5fa" }}
              onPress={btn.action}
            >
              {btn.text}
            </AlertFooterButton>
          ))}
        </AlertFooter>
      </Alert>
    </View>
  );
}
