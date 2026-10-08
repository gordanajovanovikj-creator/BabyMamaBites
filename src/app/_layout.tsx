import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { StorageProvider } from '@/data/storage-provider';
import { ProfileProvider, useProfile } from '@/features/profile/profile-context';
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
        <Stack.Screen
          name="recipe/[id]"
          options={{ headerShown: true, title: '', headerBackButtonDisplayMode: 'minimal' }}
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
          <RootStack />
        </ProfileProvider>
      </StorageProvider>
    </ThemeProvider>
  );
}
