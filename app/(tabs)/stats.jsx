import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import { useSavedUsers } from "../../hooks/useSavedUsers";

export default function StatsScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;

  const { login } = useLocalSearchParams();
  const { history, load: loadHistory } = useSearchHistory();
  const { saved,   load: loadSaved   } = useSavedUsers();

  const [darkMode, setDarkMode] = useState(true);
  const [reposByYear, setReposByYear] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      loadSaved();
      if (login) {
        fetch(`https://api.github.com/users/${login}/repos`)
          .then((r) => r.json())
          .then((repos) => {
            const counts = repos.reduce((acc, r) => {
              const yr = new Date(r.created_at).getFullYear();
              acc[yr] = (acc[yr] || 0) + 1;
              return acc;
            }, {});
            setReposByYear(
              Object.entries(counts)
                .map(([x, y]) => ({ x, y }))
                .sort((a, b) => a.x.localeCompare(b.x))
            );
          })
          .catch(console.error);
      }
    }, [login])
  );

  const bg = darkMode ? "#141C2F" : "#F4F7FF";
  const fg = darkMode ? "rgba(244,247,255,1)" : "rgba(20,28,47,1)";
  const chartConfig = {
    backgroundGradientFrom: bg,
    backgroundGradientTo: bg,
    decimalPlaces: 0,
    color:    (op) => fg.replace(/1\)$/, `${op})`),
    labelColor: (op) => fg.replace(/1\)$/, `${op})`),
  };

  let labels = [], data = [];
  if (!login && history.length) {
    const freq = history.reduce((acc, h) => ((acc[h] = (acc[h]||0)+1), acc), {});
    const top5 = Object.entries(freq)
      .map(([x,y]) => ({ x,y }))
      .sort((a,b)=>b.y-a.y)
      .slice(0,5);
    labels = top5.map(d=>d.x);
    data   = top5.map(d=>d.y);
  }

  const pieData = [
    {
      name: "Saved",
      population: saved.length,
      color: "#0079FE",
      legendFontColor: fg,
      legendFontSize: 14,
    },
    {
      name: "Others",
      population: Math.max(0, history.length - saved.length),
      color: "#888",
      legendFontColor: fg,
      legendFontSize: 14,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(d=>!d)} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {login ? (
          <View style={styles.section}>
            <Text style={[styles.title, { color: fg }]}>
              @{login}’s Repos by Year
            </Text>
            <View style={styles.chartWrapper}>
              <BarChart
                data={{
                  labels: reposByYear.map(d=>d.x),
                  datasets: [{ data: reposByYear.map(d=>d.y) }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.title, { color: fg }]}>Top 5 Searches</Text>
              <View style={styles.chartWrapper}>
                <BarChart
                  data={{ labels, datasets: [{ data }] }}
                  width={chartWidth}
                  height={220}
                  chartConfig={chartConfig}
                  style={styles.chart}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.title, { color: fg }]}>
                Saved vs Others
              </Text>
              <View style={styles.chartWrapper}>
                <PieChart
                  data={pieData}
                  width={chartWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={styles.chart}
                />
              </View>
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
  section:   { marginBottom: 32 },
  title:     { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  chartWrapper: {
    alignItems: "center",
  },
  chart:     {
    borderRadius: 16,
  },
});