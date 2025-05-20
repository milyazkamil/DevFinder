import React from "react";
import {
  View,
  Image,
  Pressable,
  Text,
  StyleSheet,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import { useSavedUsers } from "../hooks/useSavedUsers";
import { useRouter }     from "expo-router";

export default function ProfileCard({ user, darkMode }) {
  const { addUser } = useSavedUsers();
  const router      = useRouter();

  const showQuick = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("", msg);
    }
  };

  const handleSave = () => {
    addUser(user);
    // With react-native-root-toast:
    Toast.show(`Saved @${user.login}!`, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP + 40,
      shadow: true,
      animation: true,
    });
    router.push(`saved`);
  };

  const handleStats = () => {
    Toast.show(`Opening stats for @${user.login}…`, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP + 40,
      shadow: true,
      animation: true,
    });
    router.push(`stats`);
  };

  return (
    <>
      <View
        style={[
          styles.card,
          { backgroundColor: darkMode ? "#1F2A48" : "#FEFEFE" },
        ]}
      >
        <View style={styles.row}>
          <Image
            source={
              typeof user.avatar_url === "string"
                ? { uri: user.avatar_url }
                : user.avatar_url
            }
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text
              style={[
                styles.name,
                { color: darkMode ? "#F4F7FF" : "#141C2F" },
              ]}
            >
              {user.name || "Name not available"}
            </Text>
            <Text
              style={[
                styles.login,
                { color: darkMode ? "#F4F7FF" : "#141C2F" },
              ]}
            >
              @{user.login}
            </Text>
            <Text
              style={[
                styles.bio,
                { color: darkMode ? "#F4F7FF" : "#141C2F" },
              ]}
            >
              {user.bio || "Bio not available"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <Pressable
          onPress={handleSave}
          style={[
            styles.saveBtn,
            { backgroundColor: darkMode ? "#444" : "#ddd" },
          ]}
        >
          <Text style={{ color: darkMode ? "#fff" : "#000" }}>Save</Text>
        </Pressable>

        <Pressable
          onPress={handleStats}
          style={[
            styles.statsBtn,
            { backgroundColor: darkMode ? "#444" : "#ddd" },
          ]}
        >
          <Text style={{ color: darkMode ? "#fff" : "#000" }}>Statistics</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  login: {
    fontSize: 16,
    fontStyle: "italic",
    marginVertical: 4,
  },
  bio: {
    fontSize: 14,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveBtn: {
    flex: 1,
    marginRight: 8,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "green",
  },
  statsBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#ddd",
  },
});