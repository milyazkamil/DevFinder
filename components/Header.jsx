import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function Header({ darkMode, toggleTheme }) {
  return (
    <View style={styles.header}>
      <Text style={[styles.logo, { color: darkMode ? "#F4F7FF" : "#141C2F" }]}>
        DevFinder
      </Text>
      <Pressable style={styles.toggle} onPress={toggleTheme}>
        <Text style={{ color: darkMode ? "#F4F7FF" : "#141C2F", marginRight: 8 }}>
          {darkMode ? "LIGHT" : "DARK"}
        </Text>
        <Feather
          name={darkMode ? "sun" : "moon"}
          size={20}
          color={darkMode ? "#F4F7FF" : "#141C2F"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  logo:   { fontSize: 24, fontWeight: "bold" },
  toggle: { flexDirection: "row", alignItems: "center" }
});