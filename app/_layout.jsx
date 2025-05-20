import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <Stack screenOptions={{ headerShown: false }} />
      </RootSiblingParent>
    </SafeAreaProvider>
  );
}