import React, { useEffect, useState } from "react";
import { StatusBar, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Text, View } from "@/components/themed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getThemedColors } from "@/constants/colors";
import { getStyles } from "@/constants/style";
import { Icons } from "@/components/icons";
import { STATUSBAR_HEIGHT } from "@/components/header";
import { isValidEmail, isValidPassword, isValidUsername } from "@/lib/utils";
import {
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/context/auth";
import { handleFirebaseError } from "@/firebase/error-handler";
import { FIREBASE_AUTH } from "@/firebase/config";
import { createUserProfile } from "@/firebase/docs/user";

interface FormStep {
  title: string;
  description?: string;
  validate: () => boolean;
  errorMessage: string;
  input: JSX.Element;
}

// Define a Step component to simplify rendering each step
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
  const { mutedForeground } = getThemedColors();
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

export default function SignUpPage() {
  const { authUser: user } = useAuth();
  const { background, foreground, mutedForeground } = getThemedColors();
  const { padding } = getStyles();

  const [error, setError] = useState<string | null>(null);
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
          placeholder="Fullname"
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
      validate: () =>
        formData.password.length >= 8 && isValidPassword(formData.password),
      errorMessage: "Must be a valid password.",
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
          autoFocus={true}
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
      router.push("/login");
    } else {
      setStep(step - 1);
    }
  };

  async function verificationEmail(user: User) {
    try {
      await sendEmailVerification(user);
      alert(`Verification email sent to ${user.email}`);
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  async function updateVerificationEmail(user: User, email: string) {
    try {
      await updateEmail(user, email);
      await verificationEmail(user);
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  const onPressNext = async () => {
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
          try {
            const userCredential = await createUserWithEmailAndPassword(
              FIREBASE_AUTH,
              formData.email,
              formData.password
            );

            const newUser = userCredential.user;

            await updateProfile(newUser, {
              displayName: formData.fullName,
            });

            await createUserProfile({
              name: formData.fullName,
              username: formData.username,
              verified: false,
              email: formData.email,
            });
          } catch (error) {
            handleRegistrationError(error);
          }
        }
      } else {
        setStep(step + 1);
      }
      setError("");
    } else {
      setError(currentFormStep.errorMessage);
    }
  };

  const handleRegistrationError = (error: any) => {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case "auth/email-already-in-use":
          alert("Email is already in use. Please use a different email.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format. Please provide a valid email address.");
          break;
        case "auth/weak-password":
          alert("Weak password. Please use a stronger password.");
          break;
        // Add more cases for handling other Firebase Authentication error codes
        default:
          alert(errorMessage);
          break;
      }
    } else {
      alert("Something went wrong, please try again later.");
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
            <Link href={"/login"}>Already have an account?</Link>
          </View>
        </View>
      </View>
    </View>
  );
}

// import React, { useEffect, useState } from "react";
// import { StatusBar, Pressable } from "react-native";
// import { Link, router } from "expo-router";
// import { Text, View } from "@/components/themed";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { getThemedColors } from "@/constants/colors";
// import { getStyles } from "@/constants/style";
// import { Icons } from "@/components/icons";
// import { STATUSBAR_HEIGHT } from "@/components/header";
// import { isValidEmail, isValidPassword, isValidUsername } from "@/lib/utils";
// import {
//   User,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
//   updateEmail,
//   updateProfile,
// } from "firebase/auth";
// import { FIREBASE_AUTH } from "@/config/firebase";
// import { FirebaseError } from "firebase/app";
// import { useAuth } from "@/context/auth";
// import { createUserProfile } from "@/lib/action/user";

// interface FormStep {
//   title: string;
//   description?: string;
//   validate: () => boolean;
//   errorMessage: string;
//   input: JSX.Element;
// }

// export default function SignUpPage() {
//   const { user } = useAuth();

//   const { background, foreground, mutedForeground } = getThemedColors();
//   const { padding } = getStyles();

//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     fullName: user?.displayName || "",
//     password: "",
//     username: "",
//     email: user?.email || "",
//   });

//   const formSteps: FormStep[] = [
//     {
//       title: "What's your name?",
//       validate: () => formData.fullName.length >= 3,
//       errorMessage: "Must be at least 3 letters.",
//       input: (
//         <Input
//           placeholder="Fullname"
//           autoCapitalize="words"
//           autoFocus={true}
//           value={formData.fullName}
//           onChangeText={(text) => setFormData({ ...formData, fullName: text })}
//         />
//       ),
//     },
//     {
//       title: "Create a password",
//       description:
//         "Create a password with a least 8 letters or numbers. It should be something others can't guess.",
//       validate: () =>
//         formData.password.length >= 8 && isValidPassword(formData.password),
//       errorMessage: "Must be a valid password.",
//       input: (
//         <Input
//           placeholder="Password"
//           autoCapitalize="none"
//           autoCorrect={false}
//           secureTextEntry={true}
//           textContentType="password"
//           value={formData.password}
//           onChangeText={(text) => setFormData({ ...formData, password: text })}
//         />
//       ),
//     },
//     {
//       title: "Create a username",
//       description:
//         "Add a username or use or suggestion. You can change this at any time.",
//       validate: () =>
//         formData.username.length >= 3 && isValidUsername(formData.username),
//       errorMessage: "Must be a valid username.",
//       input: (
//         <Input
//           placeholder="Username"
//           autoCapitalize="none"
//           autoCorrect={false}
//           value={formData.username}
//           onChangeText={(text) => setFormData({ ...formData, username: text })}
//         />
//       ),
//     },
//     {
//       title: user ? "Verify your email" : "What's your email?",
//       description:
//         "Enter the email where you can be contacted. No one will see this on your profile.",
//       validate: () => isValidEmail(formData.email),
//       errorMessage: "Must be a valid email.",
//       input: (
//         <Input
//           placeholder="Email"
//           autoCapitalize="none"
//           keyboardType="email-address"
//           textContentType="emailAddress"
//           autoFocus={true}
//           value={formData.email}
//           onChangeText={(text) => setFormData({ ...formData, email: text })}
//         />
//       ),
//     },
//   ];

//   const [step, setStep] = useState(user ? formSteps.length - 1 : 0);

//   useEffect(() => {
//     setError(null);
//   }, [step]);

//   const onPressBack = () => {
//     if (step === 0 || user) {
//       router.push("/login");
//     } else {
//       setStep(step - 1);
//     }
//   };

//   async function verificationEmail(user: User) {
//     try {
//       await sendEmailVerification(user);
//       alert(`Verification email sent to ${user.email}`);
//     } catch (error) {
//       if (error instanceof FirebaseError) {
//         if (error.code === "auth/user-token-expired") {
//           alert("Session expired.");
//         } else {
//           console.error(error);
//           alert("Error sending verication email.");
//         }
//       } else {
//         console.error(error);
//         alert("Something went wrong, please try again later.");
//       }
//     }
//   }

//   const onPressNext = async () => {
//     const currentFormStep = formSteps[step];

//     if (currentFormStep.validate()) {
//       if (step === formSteps.length - 1) {
//         if (user) {
//           if (formData.email !== user.email) {
//             updateEmail(user, formData.email)
//               .then(async () => {
//                 await verificationEmail(user);
//               })
//               .catch((error) => {
//                 console.error(error);
//                 alert("Something went wrong, please try again.");
//               });
//           } else {
//             await verificationEmail(user);
//           }
//         } else {
//           createUserWithEmailAndPassword(
//             FIREBASE_AUTH,
//             formData.email,
//             formData.password
//           )
//             .then((userCredential) => {
//               const user = userCredential.user;
//               updateProfile(user, {
//                 displayName: formData.fullName,
//               })
//                 .then(async () => {
//                   await createUserProfile({
//                     name: formData.fullName,
//                     username: formData.username,
//                     verified: false,
//                     email: formData.email,
//                   });
//                 })
//                 .catch((error) => {
//                   console.error(error);
//                   alert("Something went wrong, please try again.");
//                 });
//             })
//             .catch((error) => {
//               if (error instanceof FirebaseError) {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//                 if (errorCode === "auth/email-already-in-use") {
//                   alert("Email already in used.");
//                 } else {
//                   alert(errorMessage);
//                 }
//               } else {
//                 alert("Something went wrong, please try again later.");
//               }
//             });
//         }
//       } else {
//         setStep(step + 1);
//       }
//       setError("");
//     } else {
//       setError(currentFormStep.errorMessage);
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar backgroundColor={background} />
//       <View style={{ marginTop: STATUSBAR_HEIGHT, flex: 1 }}>
//         <View style={{ padding: padding }}>
//           <Pressable onPress={onPressBack}>
//             {({ pressed }) => (
//               <Icons.arrowLeft color={pressed ? foreground : mutedForeground} />
//             )}
//           </Pressable>
//         </View>
//         <View style={{ justifyContent: "space-between", flex: 1 }}>
//           <View style={{ paddingHorizontal: padding, gap: padding * 1.75 }}>
//             <View style={{ gap: padding }}>
//               <Text style={{ fontSize: 24, fontWeight: "500" }}>
//                 {formSteps[step].title}
//               </Text>
//               {formSteps[step].description && (
//                 <Text style={{ color: mutedForeground }}>
//                   {formSteps[step].description}
//                 </Text>
//               )}
//             </View>
//             <View style={{ gap: padding }}>
//               {formSteps[step].input}
//               {error && <Text style={{ color: "red" }}>{error}</Text>}
//             </View>
//             <Button onPress={onPressNext}>
//               {step === formSteps.length - 1 && user ? "Verify" : "Next"}
//             </Button>
//           </View>
//           <View style={{ alignItems: "center", padding: padding * 2 }}>
//             <Link href={"/login"}>Already have an account?</Link>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { StatusBar, Pressable } from "react-native";
// import { Link, router } from "expo-router";
// import { Text, View } from "@/components/themed";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { getThemedColors } from "@/constants/colors";
// import { getStyles } from "@/constants/style";
// import { Icons } from "@/components/icons";
// import { STATUSBAR_HEIGHT } from "@/components/header";
// import { useFormik } from "formik";
// import { userSchema } from "@/lib/validation/user";

// interface FormStep {
//   title: string;
//   description?: string;
//   errorMessage: string | undefined;
//   input: JSX.Element;
// }

// export default function SignUpPage() {
//   const { background, foreground, mutedForeground } = getThemedColors();
//   const { padding } = getStyles();

//   const [step, setStep] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       email: "",
//       fullName: "",
//       password: "",
//     },
//     validationSchema: userSchema,
//     onSubmit: (values) => {
//       console.log("Form data submitted:", values);
//     },
//   });

//   const formSteps: FormStep[] = [
//     {
//       title: "What's your name?",
//       errorMessage: formik.errors.fullName,
//       input: (
//         <Input
//           placeholder="Fullname"
//           autoCapitalize="words"
//           autoFocus={true}
//           value={formik.values.fullName}
//           onChangeText={formik.handleChange("username")}
//         />
//       ),
//     },
//     {
//       title: "Create a password",
//       description:
//         "Create a password with a least 8 letters or numbers. It should be something others can't guess.",
//       errorMessage: formik.errors.password,
//       input: (
//         <Input
//           placeholder="Password"
//           autoCapitalize="none"
//           autoCorrect={false}
//           secureTextEntry={true}
//           textContentType="password"
//           value={formik.values.password}
//           onChangeText={formik.handleChange("password")}
//         />
//       ),
//     },
//     {
//       title: "Create a username",
//       description:
//         "Add a username or use or suggestion. You can change this at any time.",
//       errorMessage: formik.errors.username,
//       input: (
//         <Input
//           placeholder="Username"
//           autoCapitalize="none"
//           autoCorrect={false}
//           value={formik.values.username}
//           onChangeText={formik.handleChange("username")}
//         />
//       ),
//     },
//     {
//       title: "What's your email?",
//       description:
//         "Enter the email where you can be contacted. No one will see this on your profile.",
//       errorMessage: formik.errors.email,
//       input: (
//         <Input
//           placeholder="Email"
//           autoCapitalize="none"
//           keyboardType="email-address"
//           textContentType="emailAddress"
//           autoFocus={true}
//           value={formik.values.email}
//           onChangeText={formik.handleChange("email")}
//         />
//       ),
//     },
//   ];

//   useEffect(() => {
//     setError(null);
//   }, [step]);

//   const onPressBack = () => {
//     if (step === 0) {
//       router.push("/login");
//     } else {
//       setStep(step - 1);
//     }
//   };

//   const onPressNext = () => {
//     const currentFormStep = formSteps[step];

//     if (!currentFormStep.errorMessage) {
//       if (step === formSteps.length - 1) {
//         alert("You done!");
//         // Perform user creation on the database here
//       } else {
//         setStep(step + 1);
//       }
//       setError(null);
//     } else {
//       setError(currentFormStep.errorMessage);
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar backgroundColor={background} />
//       <View style={{ marginTop: STATUSBAR_HEIGHT, flex: 1 }}>
//         <View style={{ padding: padding }}>
//           <Pressable onPress={onPressBack}>
//             {({ pressed }) => (
//               <Icons.arrowLeft color={pressed ? foreground : mutedForeground} />
//             )}
//           </Pressable>
//         </View>
//         <View style={{ justifyContent: "space-between", flex: 1 }}>
//           <View style={{ paddingHorizontal: padding, gap: padding * 1.75 }}>
//             <View style={{ gap: padding }}>
//               <Text style={{ fontSize: 24, fontWeight: "500" }}>
//                 {formSteps[step].title}
//               </Text>
//               {formSteps[step].description && (
//                 <Text style={{ color: mutedForeground }}>
//                   {formSteps[step].description}
//                 </Text>
//               )}
//             </View>
//             <View style={{ gap: padding }}>
//               {formSteps[step].input}
//               {error && <Text style={{ color: "red" }}>{error}</Text>}
//             </View>
//             <Button onPress={onPressNext}>
//               {step === formSteps.length - 1 ? "Finish" : "Next"}
//             </Button>
//           </View>
//           <View style={{ alignItems: "center", padding: padding * 2 }}>
//             <Link href={"/login"}>Already have an account?</Link>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }
