// screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";

type WelcomeNavigationProps = NativeStackNavigationProp<
  RootParamList,
  "Welcome"
>;

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavigationProps>();

  return (
    <View style={styles.container}>
      {/* Background Circles */}
      <View style={styles.circleTopLeft}></View>
      <View style={styles.circleTopRight}></View>

      {/* Header Title */}
      <Text style={styles.title}>
        WELCOME TO <Text style={styles.logoText}>TO</Text>
        <Text style={styles.logoTextBold}>DO</Text>
        <Text style={styles.logoText}>DOO</Text>!
      </Text>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/welcome.png")} // Replace with your image path
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>Get things done with ease.</Text>
      <Text style={styles.subDescription}>
        Organize your tasks, stay focused, and achieve more every day.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E9FF", // Soft lavender background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  circleTopLeft: {
    position: "absolute",
    top: -70,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 120,
    backgroundColor: "rgba(235, 158, 202, 0.3)", // Light peach
  },
  circleTopRight: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 200, 150, 0.2)", // Light orange
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#9B5DE5", // Purple
  },
  logoTextBold: {
    fontSize: 30,
    fontWeight: "600",
    color: "#F7C300", // Golden yellow
  },
  imageContainer: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9B5DE5",
    textAlign: "center",
    marginBottom: 10,
  },
  subDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#9B5DE5",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
