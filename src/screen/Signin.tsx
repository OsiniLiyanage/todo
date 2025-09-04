import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SigninNavigationProps = NativeStackNavigationProp<RootParamList, "Signin">;

const PUBLIC_URL = "https://fd8760f3e9e7.ngrok-free.app";

export function SigninScreen() {
  const navigation = useNavigation<SigninNavigationProps>();

  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");

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
          <View style={styles.circleBottomLeft} />

          {/* Header */}
          <Text style={styles.title}>Welcome Back!</Text>

          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/signin.png")} // Replace with your image
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL ADDRESS:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={getEmail}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD:</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={getPassword}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const loginDetails = {
                  email: getEmail,
                  password: getPassword,
                };

                const loginJSON = JSON.stringify(loginDetails);
                const response = await fetch(PUBLIC_URL + "/ToDoDoo/SignIn", {
                  method: "POST",
                  body: loginJSON,
                  headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "any-value",
                  },
                });
                if (response.ok) {
                  const json = await response.json();
                  console.log(json);
                  if (json.status) {
                    //console.log("login success");
                    Toast.show({
                      type: ALERT_TYPE.SUCCESS,
                      title: "Success",
                      textBody: "Congrats! Logging successfully",
                    });

                    const userData = {
                      userId: json.user.id,
                      email: json.user.email,
                      name: json.user.firstName + " " + json.user.lastName,
                    };
                    await AsyncStorage.setItem(
                      "user",
                      JSON.stringify(userData)
                    );

                    // Navigate to Home
                    navigation.navigate("Home", userData);
                  } else {
                    console.log(json.message);
                    Toast.show({
                      type: ALERT_TYPE.DANGER,
                      title: "Error",
                      textBody: json.message,
                    });
                  }
                } else {
                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: " Logging failed. Please try again",
                  });
                }
              }}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text
                  style={[styles.linkText, styles.link]}
                  onPress={() => navigation.goBack()}
                >
                  Sign up
                </Text>
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
    backgroundColor: "#F3E9FF", // Light yellow background
  },
  subContainer: {
    flex: 1,
  },
  circleTopLeft: {
    position: "absolute",
    top: -30,
    left: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  circleTopRight: {
    position: "absolute",
    top: 40,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  circleMiddleLeft: {
    position: "absolute",
    top: 180,
    left: 20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  circleBottomRight: {
    position: "absolute",
    bottom: -20,
    right: -30,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  circleBottomLeft: {
    position: "absolute",
    bottom: -20,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 125,
    backgroundColor: "rgba(255, 150, 200, 0.3)",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 100,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginHorizontal: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "center",
    marginVertical: 10,
  },
  forgotText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: "underline",
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
