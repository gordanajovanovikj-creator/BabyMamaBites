import '@/global.css';

import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { StorageProvider } from '@/data/storage-provider';
import { CalendarProvider } from '@/features/calendar/calendar-context';
import { FavoritesProvider } from '@/features/favorites/favorites-context';
import { DisclaimerProvider, useDisclaimer } from '@/features/legal/disclaimer-context';
import { headerBackButton } from '@/features/navigation/header-back-button';
import { PlannerProvider } from '@/features/planner/planner-context';
import { useTodayWidgetSync } from '@/features/planner/use-today-widget-sync';
import { ProfileProvider, useProfile } from '@/features/profile/profile-context';
import { RemindersProvider } from '@/features/reminders/reminders-context';
import { FoodLogProvider } from '@/features/solids/food-log-context';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootStack() {
  const { ready: profileReady, profile } = useProfile();
  const { ready: disclaimerReady, acceptedOn } = useDisclaimer();
  const ready = profileReady && disclaimerReady;
  useTodayWidgetSync();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;
  // The app opens only once the medical disclaimer has been accepted on this phone.
  const accepted = acceptedOn !== null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerLeft: headerBackButton,
      }}
    >
      <Stack.Protected guard={!!profile && accepted}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="about"
          options={{ presentation: 'modal', headerShown: true, title: 'About & safety' }}
        />
        <Stack.Screen name="insight/[id]" />
        <Stack.Screen name="guide/[id]" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen
          name="recipe/cook/[id]"
          // Its own ✕ button closes it: a full-screen modal has no back gesture or header back.
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="food/[id]" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="solids/week/[n]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen
          name="solids/log"
          options={{ presentation: 'modal', headerShown: true, title: 'New food' }}
        />
        <Stack.Screen name="solids/article/[id]" />
        <Stack.Screen name="solids/readiness" />
        <Stack.Screen
          name="planner/pick"
          options={{ presentation: 'modal', headerShown: true, title: 'Choose a meal' }}
        />
        <Stack.Screen
          name="planner/add"
          options={{
            // A bottom sheet over the food or recipe, so you never lose your place.
            presentation: 'formSheet',
            sheetAllowedDetents: [0.6, 1],
            sheetGrabberVisible: true,
            sheetCornerRadius: 28,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="planner/freezer-add"
          options={{ presentation: 'modal', headerShown: true, title: 'Add to freezer' }}
        />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
        <Stack.Screen name="credits" options={{ headerShown: true, title: 'Photo credits' }} />
        <Stack.Screen name="calendar/index" options={{ headerShown: true, title: 'Calendar' }} />
        <Stack.Screen
          name="calendar/add"
          options={{ presentation: 'modal', headerShown: true, title: '' }}
        />
        <Stack.Screen name="solids/history" options={{ headerShown: true, title: 'Food log' }} />
        <Stack.Screen
          name="solids/choking"
          options={{ presentation: 'modal', headerShown: true, title: 'Choking and gagging' }}
        />
      </Stack.Protected>
      {/* Set up before the disclaimer step existed: accept it once to continue. */}
      <Stack.Protected guard={!!profile && !accepted}>
        <Stack.Screen name="agree" />
      </Stack.Protected>
      <Stack.Screen name="onboarding" options={{ presentation: profile ? 'modal' : 'card' }} />
      {/* Open before setup too: the subscription and disclaimer screens link here.
          Listed after onboarding so a fresh install still starts at the welcome screen. */}
      <Stack.Screen
        name="legal/[doc]"
        options={{ presentation: 'modal', headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="disclaimer"
        options={{ presentation: 'modal', headerShown: true, title: 'Disclaimers & Terms' }}
      />
      <Stack.Screen
        name="emergency"
        options={{ presentation: 'modal', headerShown: true, title: 'Emergency & resources' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  // Light-only by design: white background at all times.
  const base = DefaultTheme;
  const palette = colors.light;

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
      <StatusBar style="dark" />
      <StorageProvider>
        <DisclaimerProvider>
          <ProfileProvider>
            <FavoritesProvider>
              <FoodLogProvider>
                <PlannerProvider>
                  <CalendarProvider>
                    <RemindersProvider>
                      <RootStack />
                    </RemindersProvider>
                  </CalendarProvider>
                </PlannerProvider>
              </FoodLogProvider>
            </FavoritesProvider>
          </ProfileProvider>
        </DisclaimerProvider>
      </StorageProvider>
    </ThemeProvider>
  );
}
