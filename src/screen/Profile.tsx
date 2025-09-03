import React, { useState, useEffect } from "react";
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
import { useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

type ProfileNavigationProps = NativeStackNavigationProp<
  RootParamList,
  "Profile"
>;

type ProfileRouteProps = RouteProp<RootParamList, "Profile">;

const PUBLIC_URL = "https://c73638c5c921.ngrok-free.app"; // ✅ No spaces

export function ProfileScreen({
  navigation,
  route,
}: {
  navigation: ProfileNavigationProps;
  route: ProfileRouteProps;
}) {
  const { userId, name } = route.params;

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_URL}/ToDoDoo/GetUserProfileData?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "any-value",
          },
        }
      );

      const json = await response.json();

      if (json.status) {
        setFirstName(json.firstName);
        setLastName(json.lastName);
        setImage(
          json.profileImagePath
            ? `${PUBLIC_URL}/ToDoDoo/profile_image/${json.profileImagePath}`
            : null
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      if (image && !image.startsWith("http")) {
        // If it's a local file path (from ImagePicker), add it
        formData.append("profileImage", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      const response = await fetch(
        `${PUBLIC_URL}/ToDoDoo/UpdateProfile?userId=${userId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "any-value",
          },
        }
      );

      const json = await response.json();

      if (json.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Profile updated successfully",
        });
        setIsEditing(false);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: json.message || "Update failed",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Network Error",
        textBody: "Unable to connect to server",
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={40}
        style={{ flex: 1 }}
      >
        {/* Background Circles */}
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
          {/* Profile Image */}
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

          {/* Name */}
          <Text style={styles.name}>{name}</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Buttons */}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>SAVE CHANGES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageUploader: {
    width: 160,
    height: 160,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
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
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
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
  cancelButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
