// app/(tabs)/_layout.jsx
import React from 'react';
import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#141C2F' },
        tabBarActiveTintColor: '#0079FE',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Feather name="search" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Feather name="star" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <Feather name="bar-chart" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}