import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Footer({ darkMode }) {
  const color = darkMode ? "#F4F7FF" : "#141C2F";

  return (
    <View style={[styles.footer, { borderTopColor: color }]}>
      <Text style={[styles.text, { color }]}>Developed by Milyaz Kamil</Text>
      <Pressable onPress={() => Linking.openURL("https://github.com")}>
        <FontAwesome name="github" size={24} color={color} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 12, borderTopWidth: 1 },
  text:   { fontSize: 14, marginRight: 8 }
});