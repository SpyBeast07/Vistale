import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';

import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colors = Colors.dark;

  return (
    <ThemeProvider value={DarkTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: '#121316',
            borderTopColor: '#1C1D21',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <SymbolView
                name="house.fill"
                size={size ?? 22}
                tintColor={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color, size }) => (
              <SymbolView
                name="camera.fill"
                size={size ?? 22}
                tintColor={color}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
