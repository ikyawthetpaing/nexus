import { useEffect, useState } from "react";
import { User } from "@/types";
import { router } from "expo-router";
import { updateProfile } from "firebase/auth";

import { useAlert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input, InputProps } from "@/components/ui/input";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { Spinner } from "@/components/spinner";
import { Text, View } from "@/components/themed";
import { getStyles } from "@/constants/style";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/context/theme";
import { signUp } from "@/firebase/auth";
import { handleFirebaseError } from "@/firebase/error-handler";
import { createUser } from "@/firebase/firestore";
import { isValidEmail, isValidPassword, isValidUsername } from "@/lib/utils";

interface FormStep {
  title: string;
  description?: string;
  validate: () => boolean;
  errorMessage: string;
  inputProps: InputProps;
}

function Step({
  title,
  description,
  errorMessage,
  inputProps,
  onPress,
  isFinalStep,
  loading,
}: {
  title: string;
  description: string | undefined;
  errorMessage: string | null;
  inputProps: InputProps;
  onPress: () => void;
  isFinalStep: boolean;
  loading: boolean;
}) {
  const { mutedForeground } = useTheme();
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
        <Input {...inputProps} />
        {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      </View>
      <Button onPress={onPress} disabled={loading}>
        {loading ? <Spinner /> : isFinalStep ? "Create" : "Next"}
      </Button>
    </View>
  );
}

export default function SignUpScreen() {
  const { padding } = getStyles();

  const { user } = useAuth();
  if (user) {
    router.replace("/verify-email");
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    username: "",
    email: "",
  });
  const { Alert, setAlert } = useAlert();

  const formSteps: FormStep[] = [
    {
      title: "What's your name?",
      validate: () => formData.fullName.length >= 3,
      errorMessage: "Must be at least 3 letters.",
      inputProps: {
        placeholder: "Name",
        autoCapitalize: "words",
        autoFocus: true,
        value: formData.fullName,
        onChangeText: (text) => setFormData({ ...formData, fullName: text }),
      },
    },
    {
      title: "Create a password",
      description:
        "Create a password with a least 8 letters or numbers. It should be something others can't guess.",
      validate: () =>
        formData.password.length >= 8 && isValidPassword(formData.password),
      errorMessage:
        "Minimum eight characters, at least one letter and one number.",
      inputProps: {
        placeholder: "Password",
        autoCapitalize: "none",
        autoCorrect: false,
        secureTextEntry: true,
        textContentType: "password",
        value: formData.password,
        onChangeText: (text) =>
          setFormData({ ...formData, password: text.trim() }),
      },
    },
    {
      title: "Create a username",
      description:
        "Add a username or use or suggestion. You can change this at any time.",
      validate: () =>
        formData.username.length >= 3 && isValidUsername(formData.username),
      errorMessage: "Must be a valid username.",
      inputProps: {
        placeholder: "Username",
        autoCapitalize: "none",
        autoCorrect: false,
        value: formData.username,
        onChangeText: (text) =>
          setFormData({ ...formData, username: text.trim() }),
      },
    },
    {
      title: "What's your email?",
      description:
        "Enter the email where you can be contacted. No one will see this on your profile.",
      validate: () => isValidEmail(formData.email),
      errorMessage: "Must be a valid email.",
      inputProps: {
        placeholder: "Email",
        autoCapitalize: "none",
        keyboardType: "email-address",
        textContentType: "emailAddress",
        value: formData.email,
        onChangeText: (text) =>
          setFormData({ ...formData, email: text.trim() }),
      },
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    setError(null);
  }, [currentStepIndex]);

  const onPressBack = () => {
    if (currentStepIndex === 0 || user) {
      router.push("/signin");
    } else {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  async function onPressNext() {
    try {
      const currentFormStep = formSteps[currentStepIndex];
      if (currentFormStep.validate()) {
        // final formstep creat user
        if (currentStepIndex === formSteps.length - 1) {
          setLoading(true);

          const userCredential = await signUp(
            formData.email,
            formData.password
          );

          const newUser = userCredential.user;

          // Update user's name on firebase auth
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

          await createUser(createUserData);

          setLoading(false);
        } else {
          setCurrentStepIndex(currentStepIndex + 1);
        }
        setError(null);
      } else {
        setError(currentFormStep.errorMessage);
      }
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: STATUSBAR_HEIGHT, flex: 1 }}>
        <View style={{ padding: padding }}>
          <IconButton icon="arrowLeft" onPress={onPressBack} />
        </View>
        <View style={{ justifyContent: "space-between", flex: 1 }}>
          <Step
            title={formSteps[currentStepIndex].title}
            description={formSteps[currentStepIndex].description}
            errorMessage={error}
            inputProps={formSteps[currentStepIndex].inputProps}
            onPress={onPressNext}
            isFinalStep={currentStepIndex === formSteps.length - 1}
            loading={loading}
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
      <Alert />
    </View>
  );
}
