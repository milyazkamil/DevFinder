import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import Entypo      from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather     from "@expo/vector-icons/Feather";

export default function ContactInfo({ user, darkMode }) {
  const color = darkMode ? "#F4F7FF" : "#141C2F";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Entypo name="location-pin" size={20} color={color} />
        <Text style={[styles.text, { color }]}>{user.location || 'Not Available'}</Text>
      </View>

      <View style={styles.row}>
        <FontAwesome name="building" size={20} color={color} />
        <Text style={[styles.text, { color }]}>{user.company || 'Not Available'}</Text>
      </View>

      <Pressable style={styles.row} onPress={() => Linking.openURL(user.html_url)}>
        <Feather name="link" size={20} color={color} />
        <Text style={[styles.text, { color }]}>{user.html_url || 'Not Available'}</Text>
      </Pressable>

      <View style={styles.row}>
        <Entypo name="twitter" size={20} color={color} />
        <Text style={[styles.text, { color }]}>{user.twitter_username || 'Not Available'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  row:       { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  text:      { marginLeft: 8, fontSize: 14 }
});