
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../App";

// Type for navigation
type SplashNavigationProps = NativeStackNavigationProp<RootParamList, "Splash">;

export function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProps>();
  const [fadeVisible, setFadeVisible] = useState(false);

  useEffect(() => {
    // Show splash content after a tiny delay (for fade-in)
    const fadeInTimer = setTimeout(() => {
      setFadeVisible(true);
    }, 100);

    // Navigate to Welcome after 3 seconds
    const navigateTimer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 3000);

    // Clean up timers
    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(navigateTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { opacity: fadeVisible ? 1 : 0 }]}>
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
    // Simple fade-in: opacity controlled by state
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9B5DE5", // Purple
    marginHorizontal: 4,
  },
  logoTextBold: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#F7C300", // Golden yellow accent for "DO"
    marginHorizontal: 4,
  },
});
