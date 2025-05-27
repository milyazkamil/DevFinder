// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   StatusBar,
//   View,
//   Text,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Image,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useIsFocused } from "@react-navigation/native";
// import Header from "../../components/Header";
// import { useSavedUsers } from "../../hooks/useSavedUsers";

// export default function Saved() {
//   const router    = useRouter();
//   const isFocused = useIsFocused();
//   const { saved, removeUser, load } = useSavedUsers();
//   const [darkMode, setDarkMode] = useState(true);

//   useEffect(() => {
//     if (isFocused) load();
//   }, [isFocused, load]);

//   const bgColor   = darkMode ? "#141C2F" : "#F4F7FF";
//   const textColor = darkMode ? "#F4F7FF" : "#141C2F";

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
//       <StatusBar
//         barStyle={darkMode ? "light-content" : "dark-content"}
//         backgroundColor={bgColor}
//       />

//       <Header darkMode={darkMode} toggleTheme={() => setDarkMode(d => !d)} />

//       <View style={styles.content}>
//         {!saved.length ? (
//           <Text style={[styles.noSaved, { color: textColor }]}>
//             No saved users yet.
//           </Text>
//         ) : (
//           <FlatList
//             data={saved}
//             keyExtractor={item => item.login}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             renderItem={({ item }) => (
//               <View style={styles.row}>
//                 <Pressable onPress={() => router.push(`/${item.login}`)}>
//                   <Image
//                     source={{ uri: item.avatar_url }}
//                     style={styles.avatar}
//                   />
//                 </Pressable>
//                 <View style={styles.info}>
//                   <Pressable onPress={() => router.push(`https://www.github.com/${item.login}`)}>
//                     <Text style={[styles.name, { color: textColor }]}>
//                       {item.name || `@${item.login}`}
//                     </Text>
//                   </Pressable>
//                   <Text style={[styles.login, { color: textColor }]}>
//                     @{item.login}
//                   </Text>
//                 </View>
//                 <Pressable onPress={() => removeUser(item.login)}>
//                   <Text style={styles.remove}>×</Text>
//                 </Pressable>
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   content:   { flex: 1, padding: 16 },
//   noSaved:   { textAlign: "center", marginTop: 20, fontSize: 16 },

//   row:       {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//   },
//   avatar:    { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
//   info:      { flex: 1 },
//   name:      { fontSize: 16, fontWeight: "600" },
//   login:     { fontSize: 14, color: "#888", marginTop: 2 },
//   remove:    { fontSize: 24, color: "red", paddingHorizontal: 12 },

//   separator: { height: 1, backgroundColor: "#666", marginVertical: 4 },
// });



import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import { useSavedUsers } from "../../hooks/useSavedUsers";

export default function StatsScreen() {
  const { login } = useLocalSearchParams();
  const { history, load: loadHistory } = useSearchHistory();
  const { saved, load: loadSaved } = useSavedUsers();

  const [darkMode, setDarkMode] = useState(true);
  const [userStats, setUserStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      loadSaved();

      if (login) {
        (async () => {
          try {
            const u = await fetch(`https://api.github.com/users/${login}`)
              .then(r => r.json());
            const repos = await fetch(u.repos_url).then(r => r.json());
            const byYear = repos.reduce((acc, r) => {
              const yr = new Date(r.created_at).getFullYear();
              acc[yr] = (acc[yr] || 0) + 1;
              return acc;
            }, {});
            const reposByYear = Object.entries(byYear)
              .map(([year, count]) => ({ year, count }))
              .sort((a, b) => a.year - b.year);

            setUserStats({
              public_repos: u.public_repos,
              followers: u.followers,
              following: u.following,
              reposByYear,
            });
          } catch (e) {
            console.error(e);
          }
        })();
      }
    }, [login])
  );

  // Theme colors
  const bg     = darkMode ? "#141C2F" : "#F4F7FF";
  const fg     = darkMode ? "#F4F7FF" : "#141C2F";
  const cardBg = darkMode ? "#1F2A48" : "#FEFEFE";
  const border = darkMode ? "#2A324B" : "#E0E0E0";
  const subTxt = darkMode ? "#AEB2C1" : "#555555";

  // Overall stats
  const totalSearches  = history.length;
  const uniqueSearches = new Set(history).size;
  const savedCount     = saved.length;

  // Top 5 searches
  const freq = history.reduce((acc, q) => {
    acc[q] = (acc[q] || 0) + 1;
    return acc;
  }, {});
  const top5 = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(d => !d)} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {login && userStats ? (
          <>
            <View style={[styles.section, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: fg }]}>
                @{login}’s Stats
              </Text>
              {["public_repos", "followers", "following"].map(key => (
                <View key={key} style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: subTxt }]}>
                    {key.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}:
                  </Text>
                  <Text style={[styles.statValue, { color: fg }]}>
                    {userStats[key]}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.section, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: fg }]}>
                Repos by Year
              </Text>
              {userStats.reposByYear.map(({ year, count }) => (
                <View key={year} style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: subTxt }]}>
                    {year}
                  </Text>
                  <Text style={[styles.statValue, { color: fg }]}>
                    {count}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={[styles.section, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: fg }]}>
                Overall App Stats
              </Text>
              {[
                ["Total Searches", totalSearches],
                ["Unique Searches", uniqueSearches],
                ["Saved Profiles", savedCount],
              ].map(([label, val]) => (
                <View key={label} style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: subTxt }]}>
                    {label}:
                  </Text>
                  <Text style={[styles.statValue, { color: fg }]}>
                    {val}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.section, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: fg }]}>
                Top 5 Searches
              </Text>
              {top5.map(([q, count]) => (
                <View key={q} style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: subTxt }]}>
                    {q}
                  </Text>
                  <Text style={[styles.statValue, { color: fg }]}>
                    {count}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { padding: 16, paddingBottom: 32 },
  section: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: { fontSize: 16 },
  statValue: { fontSize: 16, fontWeight: "bold" },
});