import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function SearchBar({ input, setInput, onSearch, darkMode }) {
  return (
    <View style={[
        styles.container,
        { backgroundColor: darkMode ? "#1F2A48" : "#FEFEFE" }
      ]}>
      <Feather name="search" size={20} color={darkMode ? "#F4F7FF" : "#141C2F"} />
      <TextInput
        style={[styles.input, { color: darkMode ? "#F4F7FF" : "#141C2F" }]}
        placeholder="Search GitHub Users..."
        placeholderTextColor={darkMode ? "#D9D6D6" : "#666"}
        value={input}
        onChangeText={setInput}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <Pressable style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flexDirection: "row", alignItems: "center", margin: 16, padding: 8, borderRadius: 12 },
  input:      { flex: 1, marginHorizontal: 8, fontSize: 16 },
  button:     { backgroundColor: "#0079FE", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  buttonText: { color: "#FFF", fontWeight: "600" }
});