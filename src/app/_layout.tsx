import '@/global.css';

import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { StorageProvider } from '@/data/storage-provider';
import { CalendarProvider } from '@/features/calendar/calendar-context';
import { FavoritesProvider } from '@/features/favorites/favorites-context';
import { DisclaimerProvider, useDisclaimer } from '@/features/legal/disclaimer-context';
import { LogoIntro } from '@/features/intro/logo-intro';
import { headerBackButton } from '@/features/navigation/header-back-button';
import { PlannerProvider } from '@/features/planner/planner-context';
import { useTodayWidgetSync } from '@/features/planner/use-today-widget-sync';
import { ProfileProvider, useProfile } from '@/features/profile/profile-context';
import { RemindersProvider } from '@/features/reminders/reminders-context';
import { ShoppingProvider } from '@/features/shopping/shopping-context';
import { FoodLogProvider } from '@/features/solids/food-log-context';
import { SubscriptionProvider } from '@/features/subscription/subscription-context';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootStack() {
  const { ready: profileReady, profile } = useProfile();
  const { ready: disclaimerReady, acceptedOn } = useDisclaimer();
  const ready = profileReady && disclaimerReady;
  useTodayWidgetSync();
  // The opening logo plays over the app while it loads, then fades away.
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const intro = introDone ? null : <LogoIntro appReady={ready} onDone={finishIntro} />;

  // The app opens only once the medical disclaimer has been accepted on this phone.
  const accepted = acceptedOn !== null;

  // The intro stays in the same place in the tree, so it keeps playing when the app is ready.
  return (
    <View className="flex-1">
      {ready ? (
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
              name="planner/family"
              options={{ presentation: 'modal', headerShown: true, title: 'Family meal' }}
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
            <Stack.Screen
              name="calendar/index"
              options={{ headerShown: true, title: 'Calendar' }}
            />
            <Stack.Screen
              name="calendar/add"
              options={{ presentation: 'modal', headerShown: true, title: '' }}
            />
            <Stack.Screen
              name="shopping/index"
              // The page's own header shows the title with the logo.
              options={{ headerShown: true, title: '' }}
            />
            <Stack.Screen
              name="shopping/add"
              options={{ presentation: 'modal', headerShown: true, title: 'Add to shopping list' }}
            />
            <Stack.Screen
              name="solids/history"
              options={{ headerShown: true, title: 'Food log' }}
            />
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
            name="paywall"
            options={{ presentation: 'modal', headerShown: true, title: '' }}
          />
          <Stack.Screen
            name="legal/[doc]"
            options={{ presentation: 'modal', headerShown: true, title: '' }}
          />
          <Stack.Screen
            name="disclaimer"
            options={{ presentation: 'modal', headerShown: true, title: 'Disclaimers & terms' }}
          />
          <Stack.Screen
            name="emergency"
            options={{ presentation: 'modal', headerShown: true, title: 'Emergency & resources' }}
          />
        </Stack>
      ) : null}
      {intro}
    </View>
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
                    <ShoppingProvider>
                      <SubscriptionProvider>
                        <RemindersProvider>
                          <RootStack />
                        </RemindersProvider>
                      </SubscriptionProvider>
                    </ShoppingProvider>
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
