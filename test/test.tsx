import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const PUBLIC_URL = "https://d4da9e12fde9.ngrok-free.app";

export default function SignInScreen() {
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={40}
      style={styles.container}
    >
      <AlertNotificationRoot>
        <ScrollView style={styles.subContainer}>
          <View>
            <View style={styles.profileContainer}>
              <Image
                style={{ height: 100, width: 100 }}
                source={require("./assets/book.png")}
              />
            </View>
            <View>
              <Text style={styles.headerText}>WELCOME TO</Text>
            </View>

            <View style={styles.header2}>
              <Text style={styles.pageTitle}>Notebook! </Text>
              <Text style={styles.subTitle}>
                Welcome back.Please sign in to your account.
              </Text>
            </View>
          </View>
          <View style={styles.subContainer2}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL ADDRESS:</Text>
              <TextInput
                inputMode="email"
                style={styles.input}
                placeholder="Email Address"
                onChangeText={setEmail}
                value={getEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                inputMode="text"
                secureTextEntry
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={getPassword}
              />
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <Pressable style={styles.createButton1}>
              <Text
                style={styles.createButtonText1}
                onPress={() => {
                  Alert.alert("Create Account button pressed");
                }}
              >
                Create Account
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
    padding: 10,
  },
  subContainer: {
    flex: 1,
    marginTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#7281e5ff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  createButton: {
    marginTop: 20,
    alignItems: "center",
  },
  createButtonText: {
    color: "#7281e5ff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  btnContainer: {
    marginBottom: 20,
  },
  subContainer2: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  createButton1: {
    flex: 1,
    borderColor: "#7281e5ff",
    borderWidth: 2,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,

    alignItems: "center",
  },
  createButtonText1: {
    color: "#7281e5ff",
    fontWeight: "600",
  },
  header2: {
    alignItems: "center",
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
