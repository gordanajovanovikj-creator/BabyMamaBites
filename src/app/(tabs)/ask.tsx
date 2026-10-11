import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { today } from '@/domain/dates';
import { CHAT_LIMITS, detectUrgent, type ChatTurn, type UrgentKind } from '@/domain/chat';
import { babyAge } from '@/domain/stage';
import { sendChat } from '@/features/chat/chat-client';
import { UrgentHelp } from '@/features/chat/urgent-help';
import { useProfile } from '@/features/profile/profile-context';
import { AppText, Chip, cn } from '@/ui';
import { usePalette } from '@/theme/use-palette';

const SUGGESTIONS = [
  'Ideas with sweet potato and oats',
  'Easy finger foods for my baby’s age',
  'A quick, filling snack for me',
  'How do I freeze baby food?',
];

/** Ask: a simple chat with the app's helper. Conversations stay in memory and are not saved. */
export default function AskScreen() {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const { profile } = useProfile();
  const params = useLocalSearchParams<{ q?: string }>();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [urgent, setUrgent] = useState<UrgentKind | null>(null);
  const scroll = useRef<ScrollView>(null);

  // A prompt passed in from elsewhere (e.g. "Meal idea from your fridge") prefills the box once.
  const [seenQ, setSeenQ] = useState<string | undefined>(undefined);
  if (params.q && params.q !== seenQ) {
    setSeenQ(params.q);
    setInput(params.q);
  }

  const ageMonths = profile ? babyAge(profile, today()).months : null;
  const atLimit = turns.length >= CHAT_LIMITS.maxTurns - 1;

  async function send(textToSend: string) {
    const text = textToSend.trim();
    if (!text || sending || atLimit) return;
    const found = detectUrgent(text);
    if (found) setUrgent(found);
    const next: ChatTurn[] = [...turns, { role: 'user', text }];
    setTurns(next);
    setInput('');
    setProblem(null);
    setSending(true);
    const result = await sendChat(next, ageMonths);
    setSending(false);
    if (result.ok) {
      setTurns([...next, { role: 'assistant', text: result.reply }]);
    } else {
      // Put the question back so it isn't lost.
      setTurns(turns);
      setInput(text);
      setProblem(
        result.reason === 'busy'
          ? 'Lots of moms are asking right now. Please try again in a minute.'
          : result.reason === 'not-ready'
            ? "The chat helper isn't switched on yet. Please check back soon."
            : "We couldn't reach the helper. Check your connection and try again.",
      );
    }
    requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }));
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scroll}
        className="flex-1"
        contentInsetAdjustmentBehavior="never"
        contentContainerClassName="gap-4 px-5 pb-6"
        contentContainerStyle={{ paddingTop: insets.top + 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1">
          <AppText variant="display">Ask</AppText>
          <AppText variant="caption">
            Meal ideas, textures, freezing, picky eating. We&apos;re here to help.
          </AppText>
        </View>

        <View className="rounded-2xl bg-surface-muted p-4">
          <AppText variant="caption" size="sm">
            Answers are general information, not medical advice, and can be wrong. For health
            worries, call your pediatrician or doctor. In an emergency, call 911. Your chat is not
            saved on this phone.
          </AppText>
        </View>

        {urgent ? <UrgentHelp kind={urgent} /> : null}

        {turns.length === 0 ? (
          <View className="gap-2">
            <AppText variant="label">Try asking</AppText>
            <View className="flex-row flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Chip key={s} label={s} onPress={() => send(s)} />
              ))}
            </View>
          </View>
        ) : null}

        {turns.map((t, i) => (
          <View
            key={i}
            className={cn(
              'max-w-[85%] rounded-3xl px-4 py-3',
              t.role === 'user' ? 'self-end bg-primary' : 'self-start bg-sky',
            )}
          >
            <AppText color={t.role === 'user' ? 'on-primary' : 'on-sky'} selectable>
              {t.text}
            </AppText>
          </View>
        ))}

        {sending ? (
          <View className="self-start rounded-3xl bg-sky px-4 py-3">
            <AppText color="on-sky">Thinking…</AppText>
          </View>
        ) : null}

        {problem ? (
          <AppText variant="caption" color="caution">
            {problem}
          </AppText>
        ) : null}

        {atLimit ? (
          <View className="gap-2">
            <AppText variant="caption">
              This chat is getting long. Start a new one to keep going.
            </AppText>
            <Chip
              label="Start a new chat"
              onPress={() => {
                setTurns([]);
                setUrgent(null);
              }}
            />
          </View>
        ) : null}
      </ScrollView>

      <View className="flex-row items-end gap-2 border-t border-border bg-canvas px-4 py-3">
        <TextInput
          accessibilityLabel="Your question"
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything about feeding…"
          placeholderTextColor={palette.inkMuted}
          multiline
          maxLength={CHAT_LIMITS.maxChars}
          className="max-h-32 min-h-12 flex-1 rounded-3xl border-2 border-border bg-surface px-4 py-3 text-lg text-ink"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send"
          accessibilityState={{ disabled: !input.trim() || sending || atLimit }}
          disabled={!input.trim() || sending || atLimit}
          onPress={() => send(input)}
          className={cn(
            'h-12 w-12 items-center justify-center rounded-full bg-primary active:opacity-80',
            (!input.trim() || sending || atLimit) && 'opacity-40',
          )}
        >
          <AppText variant="heading" color="on-primary">
            ↑
          </AppText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
