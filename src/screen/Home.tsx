import {
  Button,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import ToDoItem from "../components/ToDoItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
};

type HomeRouteProp = RouteProp<RootParamList, "Home">;

const PUBLIC_URL = "https://fd8760f3e9e7.ngrok-free.app";

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>(); // For navigation
  const route = useRoute<HomeRouteProp>();

  const { userId, email, name } = route.params || {};

  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [profileImagePath, setProfileImagePath] = useState<string | null>(null);
  const [oldTodos, setOldTodos] = useState<ToDoType[]>([]);

  useEffect(() => {
    if (userId) {
      fetchTodos();
      fetchProfileImage();
    }
  }, [userId]);

  const fetchTodos = React.useCallback(async () => {
    try {
      const response = await fetch(
        PUBLIC_URL + `/ToDoDoo/GetTodos?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "any-value",
          },
        }
      );

      const json = await response.json();

      if (json.status && Array.isArray(json.todos)) {
        const mappedTodos = json.todos.map((t: any) => ({
          id: t.id,
          title: t.title,
          isDone: t.isDone,
        }));
        setTodos(mappedTodos);
        setOldTodos(mappedTodos);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      const saved = await AsyncStorage.getItem("my-todo");
      if (saved) setTodos(JSON.parse(saved));
    }
  }, [userId]);

  const fetchProfileImage = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_URL}/ToDoDoo/GetUserProfile?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "any-value",
          },
        }
      );

      const json = await response.json();
      console.log(json);

      if (json.status && json.profileImagePath) {
        setProfileImagePath(json.profileImagePath);
      } else {
        console.log("No profile image found");
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const addTodo = async () => {
    // Trim and validate input
    const trimmedText = todoText.trim();
    if (!trimmedText) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Empty Task",
        textBody: "Please enter a task title",
      });
      return;
    }

    // Create a temporary todo with random ID
    const newTodo = {
      id: Math.random(), // Temporary ID until synced
      title: trimmedText,
      isDone: false,
    };

    try {
      // Save to  AsyncStorage
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      setOldTodos(updatedTodos);

      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));

      // Send to backend
      const response = await fetch(PUBLIC_URL + "/ToDoDoo/AddTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any-value", // Skips ngrok warning page
        },
        body: JSON.stringify({
          title: trimmedText,
          userId: userId, // Passed from Signin/Signup
        }),
      });

      //  Parse JSON response from backend
      const json = await response.json();
      console.log(json);

      //  Show message from backend
      Toast.show({
        type: json.status ? ALERT_TYPE.SUCCESS : ALERT_TYPE.DANGER,
        title: json.status ? "Success" : "Error",
        textBody: json.message || "Something went wrong",
      });

      fetchTodos(); // Refresh from backend
    } catch (error: any) {
      console.log("Network error in addTodo:", error);

      //Still a success — data is saved locally
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Offline",
        textBody: "Task saved locally. Will sync when online.",
      });
    }

    // Reset input and dismiss keyboard
    setTodoText("");
    Keyboard.dismiss();
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(
        PUBLIC_URL + `/ToDoDoo/DeleteTodo?id=${id}&userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "any-value", //  Skip ngrok warning page
          },
        }
      );

      const json = await response.json();

      if (json.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Deleted",
          textBody: "Task removed successfully",
        });
        fetchTodos(); // Refresh from backend
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: json.message || "Delete failed",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Network Error",
        textBody: "Unable to connect to server",
      });
    }
  };

  //checkbox updaing
  const handleDone = async (id: number) => {
    try {
      const response = await fetch(
        PUBLIC_URL + `/ToDoDoo/ToggleDone?id=${id}&userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "ngrok-skip-browser-warning": "any-value", // Skips ngrok warning
          },
        }
      );

      const json = await response.json();

      if (json.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Updated",
          textBody: "Task status changed",
        });
        fetchTodos(); // Refresh from backend to sync UI
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: json.message || "Update failed",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Network Error",
        textBody: "Unable to connect to server",
      });
    }
  };

  const onSearch = async (query: string) => {
    if (query.trim() === "") {
      // If search is empty, load all todos
      fetchTodos();
    } else {
      try {
        const response = await fetch(
          `${PUBLIC_URL}/ToDoDoo/SearchTodos?userId=${userId}&query=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "any-value",
            },
          }
        );

        const json = await response.json();

        if (json.status && Array.isArray(json.todos)) {
          const mapped = json.todos.map((t: any) => ({
            id: t.id,
            title: t.title,
            isDone: t.isDone,
          }));
          setTodos(mapped);
        } else {
          setTodos([]);
        }
      } catch (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Search failed",
        });
      }
    }
  };

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery]);

  const editTodo = React.useCallback(
    async (id: number, newTitle: string) => {
      const trimmedTitle = newTitle.trim();
      if (!trimmedTitle) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Empty Title",
          textBody: "Task title cannot be empty",
        });
        return;
      }

      try {
        const response = await fetch(
          `${PUBLIC_URL}/ToDoDoo/EditTodo?id=${id}&userId=${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "ngrok-skip-browser-warning": "any-value",
            },
            body: `title=${encodeURIComponent(trimmedTitle)}`, //Proper encoding
          }
        );

        const json = await response.json();
        console.log(json);

        if (json.status) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Updated",
            textBody: "Task updated successfully",
          });
          fetchTodos();
        } else {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Failed",
            textBody: json.message || "Could not update task",
          });
        }
      } catch (error) {
        console.error("Error in editTodo:", error);

        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Network Error",
          textBody: "Unable to connect to server. Will save locally?",
        });

        // Update local state
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, title: trimmedTitle } : todo
          )
        );
        setOldTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, title: trimmedTitle } : todo
          )
        );

        // Save to AsyncStorage
        try {
          const saved = await AsyncStorage.getItem("my-todo");
          if (saved) {
            const parsed = JSON.parse(saved);
            const updated = parsed.map((t: ToDoType) =>
              t.id === id ? { ...t, title: trimmedTitle } : t
            );
            await AsyncStorage.setItem("my-todo", JSON.stringify(updated));
          }
        } catch (storageError) {
          console.log("Failed to save to AsyncStorage", storageError);
        }
      }
    },
    [userId, fetchTodos]
  );

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.container}>
        <View style={styles.circleTopLeft} />
        <View style={styles.circleTopRight} />
        <View style={styles.circleMiddleLeft} />
        <View style={styles.circleBottomRight} />

        <View style={styles.header}>
          {/* Add Toggle Button */}
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 10 }}>
            <Ionicons size={24} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              Hello, {name ? name.split(" ")[0] : "User"}! {"\u{1F44B}"}
            </Text>
            {email && (
              <Text
                style={styles.userEmail}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {email}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { userId, name })}
          >
            <Image
              source={
                profileImagePath
                  ? {
                      uri: `${PUBLIC_URL}/ToDoDoo/profile_image/${profileImagePath}`,
                    } // Load from server
                  : require("../../assets/user.png") // Fallback
              }
              style={{ width: 40, height: 40, borderRadius: 60 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color={"rgba(103, 3, 51, 0.83)"} />
          <TextInput
            placeholder="Search Tasks Here..."
            style={styles.searchInput}
            clearButtonMode="always"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <FlatList
          data={[...todos].reverse()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ToDoItem
              todo={item}
              deleteTodo={deleteTodo}
              handleTodo={handleDone}
              onEditSubmit={editTodo}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks yet!</Text>
              <Text style={styles.emptySubText}>
                Add your first task to get started.
              </Text>
            </View>
          }
        />

        <KeyboardAvoidingView
          style={styles.footer}
          behavior="padding"
          keyboardVerticalOffset={30}
        >
          <View style={styles.footerinfo}>
            <TextInput
              placeholder="Add New ToDo"
              style={styles.newTodoInput}
              autoCorrect={false}
              onChangeText={(text) => setTodoText(text)}
              value={todoText}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addTodo()}
            >
              <Ionicons name="add" size={34} color={"#fff"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F3E9FF",
    marginTop: 20,
  },
  header: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 16,

    paddingVertical: Platform.OS === "ios" ? 16 : 8,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "rgba(103, 3, 51, 0.83)",
    fontWeight: 600,
  },

  footer: {
    bottom: 20,
  },
  footerinfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d3b3e3ff",
    padding: 10,
    borderRadius: 10,
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "rgba(230, 48, 136, 0.83)",
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    maxWidth: 250,
  },
});
