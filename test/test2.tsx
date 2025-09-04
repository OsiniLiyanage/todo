// screens/SignupScreen.tsx

import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";

type SignupNavigationProps = NativeStackNavigationProp<RootParamList, "Signup">;

export function SignupScreen() {
  const navigation = useNavigation<SignupNavigationProps>();

  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getConfirmPassword, setConfirmPassword] = useState("");

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={40}
      style={styles.container}
    >
      <AlertNotificationRoot>
        <ScrollView
          style={styles.subContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Background Circles */}
          <View style={styles.circleTopLeft} />
          <View style={styles.circleTopRight} />
          <View style={styles.circleMiddleLeft} />
          <View style={styles.circleBottomRight} />

          <View style={styles.formContainer}>
            {/* Header */}
            <Text style={styles.title}>Welcome Onboard!</Text>
            <Text style={styles.subtitle}>
              Let's help you meet up your tasks
            </Text>

            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>FIRST NAME:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your First name"
                value={getFirstName}
                onChangeText={setFirstName}
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>LAST NAME:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Last name"
                value={getLastName}
                onChangeText={setLastName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL ADDRESS:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={getEmail}
                onChangeText={setEmail}
                inputMode="email"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={getPassword}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CONFIRM PASSWORD:</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={getConfirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Sign Up Button */}
            <Pressable style={styles.button} onPress={() => {}}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            {/* Sign In Link */}
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.link}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </AlertNotificationRoot>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E9FF",
  },
  subContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingVertical: 60,
  },
  // Circles - Positioned Exactly Like in Image
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
    bottom: -20,
    right: -30,
    width: 300,
    height: 300,
    borderRadius: 160,
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
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: "white",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#9B5DE5",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
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
});
