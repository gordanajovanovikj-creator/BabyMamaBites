import { useEventListener } from 'expo';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeOut, useReducedMotion } from 'react-native-reanimated';

/** Same size as the native splash image (`imageWidth` in app.json), so the hand-off is seamless. */
const LOGO_SIZE = 320;
/** If the video can't play for any reason, the app still opens. */
const SAFETY_MS = 4000;
/** With Reduce Motion, the still logo shows briefly instead of the animation. */
const STILL_MS = 700;

const clip = require('@/assets/videos/logo-intro.mp4');
const stillLogo = require('@/assets/images/logo-full.png');

/**
 * The opening logo: the native splash shows the mark, then "Mama & Baby Bites" types in
 * (about 2 seconds) and fades into the app. It waits for the app to be ready, never plays
 * sound, and doesn't interrupt music or podcasts.
 */
export function LogoIntro({ appReady, onDone }: { appReady: boolean; onDone(): void }) {
  const reduceMotion = useReducedMotion();
  const [finished, setFinished] = useState(false);
  const splashHidden = useRef(false);

  const player = useVideoPlayer(reduceMotion ? null : clip, (p) => {
    p.muted = true;
    p.loop = false;
    p.audioMixingMode = 'mixWithOthers';
    // Start right away: a local clip can be ready before any listener is attached.
    p.play();
  });

  const hideSplash = () => {
    if (splashHidden.current) return;
    splashHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  };

  useEventListener(player, 'playToEnd', () => setFinished(true));
  // Start as soon as the clip can play; if it can't, open the app right away.
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'readyToPlay') player.play();
    if (status === 'error') {
      hideSplash();
      setFinished(true);
    }
  });

  // Backup: if the clip became ready before we were listening and isn't playing, start it.
  useEffect(() => {
    if (!reduceMotion && player.status === 'readyToPlay' && !player.playing) player.play();
  }, [player, reduceMotion]);

  useEffect(() => {
    // Reduce Motion: no animation, just the still logo for a moment.
    if (reduceMotion) {
      hideSplash();
      const t = setTimeout(() => setFinished(true), STILL_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      hideSplash();
      setFinished(true);
    }, SAFETY_MS);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (finished && appReady) onDone();
  }, [finished, appReady, onDone]);

  return (
    <Animated.View
      exiting={FadeOut.duration(300)}
      className="absolute inset-0 items-center justify-center bg-accent"
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mama & Baby Bites"
      // Above the native screen stack while the app loads underneath.
      style={{ pointerEvents: 'none', zIndex: 100, elevation: 100 }}
    >
      <View style={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
        {reduceMotion ? (
          <Image
            source={stillLogo}
            contentFit="contain"
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          />
        ) : (
          <VideoView
            player={player}
            nativeControls={false}
            contentFit="contain"
            allowsPictureInPicture={false}
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
            // The first frame matches the native splash, so the swap is seamless.
            onFirstFrameRender={hideSplash}
          />
        )}
      </View>
    </Animated.View>
  );
}
