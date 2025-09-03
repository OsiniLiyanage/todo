// screens/SignupScreen.tsx
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

type SignupNavigationProps = NativeStackNavigationProp<RootParamList, "Signup">;

const PUBLIC_URL = "https://c73638c5c921.ngrok-free.app";

export function SignupScreen() {
  const navigation = useNavigation<SignupNavigationProps>();

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={40}
        style={{ flex: 1 }}
      >
        {/* Background Circles (Fixed Position) */}
        <View style={styles.background}>
          <View style={styles.circleTopLeft} />
          <View style={styles.circleTopRight} />
          <View style={styles.circleMiddleLeft} />
          <View style={styles.circleBottomRight} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>Welcome Onboard!</Text>
          <Text style={styles.subtitle}>Let's help you meet up your tasks</Text>

          <View style={styles.form}>
            <View style={styles.imageContainer}>
              <Pressable onPress={pickImage} style={styles.imageUploader}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>+</Text>
                    <Text style={styles.imageLabel}>Add image</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* First Name */}
            <TextInput
              style={styles.input}
              placeholder="Enter Your First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            {/* Last Name */}
            <TextInput
              style={styles.input}
              placeholder="Enter Your Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            {/* Email */}
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password */}
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Confirm Password */}
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (password != confirmPassword) {
                  Alert.alert("Password and Confirm Password must be same");
                  return;
                }

                let formData = new FormData();
                formData.append("firstName", firstName);
                formData.append("lastName", lastName);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("confirmPassword", confirmPassword);

                if (image) {
                  formData.append("profileImage", {
                    uri: image,
                    name: "profile.jpg",
                    type: "image/jpeg",
                  } as any);
                }

                const response = await fetch(PUBLIC_URL + "/ToDoDoo/SignUp", {
                  method: "POST",
                  body: formData,
                  headers: {
                    "Content-Type": "multipart/form-data",
                    "ngrok-skip-browser-warning": "any-value",
                  },
                });

                if (response.ok) {
                  const json = await response.json();
                  if (json.status) {
                    console.log(json);
                    //Alert.alert("Congrats! Account created successfully");
                    navigation.navigate("Home", {
                      userId: json.user.id,
                      email: json.user.email,
                      name: json.user.firstName + " " + json.user.lastName,
                    });

                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");

                    setImage(null);
                  } else {
                    Alert.alert(json.message);
                    Toast.show({
                      type: ALERT_TYPE.DANGER,
                      title: "Error",
                      textBody: json.message,
                    });
                  }
                } else {
                  Alert.alert("Sign Up failed. Please try again.");
                }
              }}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text
                  style={[styles.linkText, styles.link]}
                  onPress={() => navigation.navigate("Signin")}
                >
                  Sign in
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject, // Full screen
    backgroundColor: "#F3E9FF",
    zIndex: 1,
  },
  container: {
    flex: 1,
    zIndex: 2,
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingVertical: 80,
    alignItems: "center",
  },
  circleTopLeft: {
    position: "absolute",
    top: -20,
    left: -10,
    width: 200,
    height: 200,
    borderRadius: 95,
    backgroundColor: "rgba(255, 200, 200, 0.3)",
  },
  circleTopRight: {
    position: "absolute",
    top: 40,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 130,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  circleMiddleLeft: {
    position: "absolute",
    top: 200,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  circleBottomRight: {
    position: "absolute",
    bottom: -50,
    right: -30,
    width: 300,
    height: 300,
    borderRadius: 250,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "white",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#9B5DE5",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    color: "#9B5DE5",
    fontWeight: "600",
  },
  form: {
    marginTop: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageUploader: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imageText: {
    fontSize: 40,
    color: "#888",
  },
  imageLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
