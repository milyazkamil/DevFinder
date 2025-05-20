import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import Header      from "../../components/Header";
import SearchBar   from "../../components/SearchBar";
import ProfileCard from "../../components/ProfileCard";
import Stats       from "../../components/Stats";
import ContactInfo from "../../components/ContactInfo";
import Footer      from "../../components/Footer";
import { useSearchHistory } from "../../hooks/useSearchHistory";

const notFoundImage = require("../../assets/images/user-not-found.png");

export default function Index() {
  const [input,    setInput]    = useState("");
  const [username, setUsername] = useState("milyazkamil");
  const [user,     setUser]     = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const { addSearch } = useSearchHistory();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`https://api.github.com/users/${username}`);
        if (resp.status === 404) {
          setUser({
            name:             `User named ${username} was not found`,
            login:            "anonymous",
            avatar_url:       notFoundImage,
            bio:              "Not Available",
            public_repos:     0,
            followers:        0,
            following:        0,
            location:         "Not Available",
            company:          "Not Available",
            twitter_username: "Not Available",
            html_url:         "https://github.com/",
          });
        } else {
          setUser(await resp.json());
        }
      } catch (e) {
        console.error("GitHub fetch error:", e);
      }
    })();
  }, [username]);

  const onSearch = () => {
    const q = input.trim();
    if (!q) return;
    addSearch(q);
    setUsername(q);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#141C2F" : "#F4F7FF" }
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#141C2F" : "#F4F7FF"}
      />

      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(d => !d)}
      />

      <SearchBar
        input={input}
        setInput={setInput}
        onSearch={onSearch}
        darkMode={darkMode}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {user && (
          <>
            <ProfileCard  user={user} darkMode={darkMode} />
            <Stats        user={user} darkMode={darkMode} />
            <ContactInfo  user={user} darkMode={darkMode} />
          </>
        )}
      </ScrollView>

      <Footer darkMode={darkMode} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { padding: 16 },
});