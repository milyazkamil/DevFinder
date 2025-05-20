import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import Header from "../../components/Header";
import { useSavedUsers } from "../../hooks/useSavedUsers";

export default function Saved() {
  const router    = useRouter();
  const isFocused = useIsFocused();
  const { saved, removeUser, load } = useSavedUsers();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused, load]);

  const bgColor   = darkMode ? "#141C2F" : "#F4F7FF";
  const textColor = darkMode ? "#F4F7FF" : "#141C2F";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={bgColor}
      />

      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(d => !d)} />

      <View style={styles.content}>
        {!saved.length ? (
          <Text style={[styles.noSaved, { color: textColor }]}>
            No saved users yet.
          </Text>
        ) : (
          <FlatList
            data={saved}
            keyExtractor={item => item.login}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Pressable onPress={() => router.push(`/${item.login}`)}>
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={styles.avatar}
                  />
                </Pressable>
                <View style={styles.info}>
                  <Pressable onPress={() => router.push(`https://www.github.com/${item.login}`)}>
                    <Text style={[styles.name, { color: textColor }]}>
                      {item.name || `@${item.login}`}
                    </Text>
                  </Pressable>
                  <Text style={[styles.login, { color: textColor }]}>
                    @{item.login}
                  </Text>
                </View>
                <Pressable onPress={() => removeUser(item.login)}>
                  <Text style={styles.remove}>×</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1, padding: 16 },
  noSaved:   { textAlign: "center", marginTop: 20, fontSize: 16 },

  row:       {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  avatar:    { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  info:      { flex: 1 },
  name:      { fontSize: 16, fontWeight: "600" },
  login:     { fontSize: 14, color: "#888", marginTop: 2 },
  remove:    { fontSize: 24, color: "red", paddingHorizontal: 12 },

  separator: { height: 1, backgroundColor: "#666", marginVertical: 4 },
});