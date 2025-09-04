import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SplashNavigationProps = NativeStackNavigationProp<RootParamList, "Splash">;

export function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProps>();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          // User is logged in -- go to Home
          navigation.replace("Home", JSON.parse(user));
        } else {
          // No user -- go to Welcome
          navigation.replace("Welcome");
        }
      } catch (error) {
        console.error("Failed to check login status", error);
        navigation.replace("Welcome");
      }
    };

    // Simulate splash screen delay
    setTimeout(checkLogin, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>TO</Text>
        <Text style={styles.logoTextBold}>DO</Text>
        <Text style={styles.logoText}>DOO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E9FF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9B5DE5",
    marginHorizontal: 4,
  },
  logoTextBold: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#F7C300",
    marginHorizontal: 4,
  },
});
