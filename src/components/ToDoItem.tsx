import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
};

const ToDoItem = ({
  todo,
  deleteTodo,
  handleTodo,
  onEditSubmit,
}: {
  todo: ToDoType;
  deleteTodo: (id: number) => void;
  handleTodo: (id: number) => void;
  onEditSubmit: (id: number, newTitle: string) => void;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<TextInput>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalVisible) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Small delay to ensure modal is rendered
      return () => clearTimeout(timer);
    }
  }, [isModalVisible]);

  return (
    <>
      {/* Edit Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              ref={inputRef}
              style={styles.modalInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Edit your task"
              placeholderTextColor="#ccc"
              onSubmitEditing={() => {
                if (editedTitle.trim()) {
                  onEditSubmit(todo.id, editedTitle.trim());
                }
                setIsModalVisible(false);
              }}
              blurOnSubmit={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsModalVisible(false);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  if (editedTitle.trim()) {
                    onEditSubmit(todo.id, editedTitle.trim());
                  }
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Todo Item */}
      <View style={styles.todocontainer}>
        <View style={styles.todoinfocontainer}>
          <Checkbox
            value={todo.isDone}
            color={todo.isDone ? "rgba(230, 48, 136, 0.83)" : undefined}
            style={styles.checkbox}
            onValueChange={() => handleTodo(todo.id)}
          />

          <Text
            style={[
              styles.todotext,
              todo.isDone && {
                textDecorationLine: "line-through",
                opacity: 0.6,
              },
            ]}
          >
            {todo.title}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEditedTitle(todo.title); // Reset to current title
              setIsModalVisible(true);
            }}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color="rgba(103, 3, 51, 0.83)"
            />
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
            <Ionicons name="trash" size={24} color="rgba(103, 3, 51, 0.83)" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ToDoItem;

const styles = StyleSheet.create({
  todocontainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 5,
  },
  checkbox: {
    transform: [{ scale: 1.2 }],
  },
  todoinfocontainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  todotext: {
    fontSize: 17,
    color: "#333",
    fontWeight: 600,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  editButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(230, 48, 136, 0.5)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "rgba(230, 48, 136, 0.83)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
