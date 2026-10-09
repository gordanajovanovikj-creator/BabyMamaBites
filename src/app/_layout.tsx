import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { StorageProvider } from '@/data/storage-provider';
import { FavoritesProvider } from '@/features/favorites/favorites-context';
import { ProfileProvider, useProfile } from '@/features/profile/profile-context';
import { FoodLogProvider } from '@/features/solids/food-log-context';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootStack() {
  const { ready, profile } = useProfile();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!profile}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="about"
          options={{ presentation: 'modal', headerShown: true, title: 'About & safety' }}
        />
        <Stack.Screen
          name="insight/[id]"
          options={{ presentation: 'modal', headerShown: true, title: '' }}
        />
        <Stack.Screen
          name="guide/[id]"
          options={{ presentation: 'modal', headerShown: true, title: '' }}
        />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="solids/week/[n]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen
          name="solids/log"
          options={{ presentation: 'modal', headerShown: true, title: 'New food' }}
        />
        <Stack.Screen name="solids/article/[id]" />
        <Stack.Screen name="solids/history" options={{ headerShown: true, title: 'Food log' }} />
        <Stack.Screen
          name="solids/choking"
          options={{ presentation: 'modal', headerShown: true, title: 'Choking and gagging' }}
        />
      </Stack.Protected>
      <Stack.Screen name="onboarding" options={{ presentation: profile ? 'modal' : 'card' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const palette = colors[scheme];

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: palette.primary,
          background: palette.canvas,
          card: palette.canvas,
          text: palette.ink,
          border: palette.border,
        },
      }}
    >
      <StatusBar style="auto" />
      <StorageProvider>
        <ProfileProvider>
          <FavoritesProvider>
            <FoodLogProvider>
              <RootStack />
            </FoodLogProvider>
          </FavoritesProvider>
        </ProfileProvider>
      </StorageProvider>
    </ThemeProvider>
  );
}
