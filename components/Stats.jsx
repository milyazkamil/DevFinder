import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Stats({ user, darkMode }) {
  const bg = darkMode ? "#141C2F" : "#F5F8FF";
  const txt = darkMode ? "#F4F7FF" : "#141C2F";

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {[
        ["Repos",     user.public_repos],
        ["Followers", user.followers],
        ["Following", user.following],
      ].map(([label, value]) => (
        <View key={label} style={styles.block}>
          <Text style={[styles.label, { color: txt }]}>{label}</Text>
          <Text style={[styles.value, { color: txt }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-around", padding: 12, borderRadius: 12, marginBottom: 16 },
  block:     { alignItems: "center" },
  label:     { fontSize: 14 },
  value:     { fontSize: 18, fontWeight: "600", marginTop: 4 }
});