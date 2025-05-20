import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "SAVED_GITHUB_USERS";

export function useSavedUsers() {
  const [saved, setSaved] = useState([]);

  const load = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      setSaved(json ? JSON.parse(json) : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addUser = async (userObj) => {
    if (saved.find(u => u.login === userObj.login)) return;
    const next = [userObj, ...saved];
    setSaved(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const removeUser = async (login) => {
    const next = saved.filter(u => u.login !== login);
    setSaved(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return { saved, addUser, removeUser, load };
}