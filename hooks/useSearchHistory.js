import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "GITHUB_SEARCH_HISTORY";

export function useSearchHistory() {
  const [history, setHistory] = useState([]);

  const load = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(KEY);
      setHistory(json ? JSON.parse(json) : []);
    } catch (e) {
      console.error("Load history failed:", e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addSearch = async (login) => {
    const next = [login, ...history];
    setHistory(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(KEY);
  };

  return { history, addSearch, clearHistory, load };
}