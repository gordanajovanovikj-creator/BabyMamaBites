import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { babyRecipes } from '@/content/recipes';
import { today, type IsoDate } from '@/domain/dates';
import { makeFreezerItem } from '@/domain/planner';
import { usePlanner } from '@/features/planner/planner-context';
import { AppText, Button, Chip, DateField, Screen, TextField } from '@/ui';

const freezable = babyRecipes.filter((r) => r.tags.includes('freezer-friendly'));

function Step({ label, glyph, onPress }: { label: string; glyph: string; onPress(): void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      className="h-14 w-14 items-center justify-center rounded-full bg-surface-muted active:opacity-70"
    >
      <AppText variant="title" size="2xl" color="primary">
        {glyph}
      </AppText>
    </Pressable>
  );
}

export default function FreezerAddScreen() {
  const { saveFreezerItem } = usePlanner();
  const now = today();
  const [name, setName] = useState('');
  const [cubes, setCubes] = useState(6);
  const [frozenOn, setFrozenOn] = useState<IsoDate>(now);

  const save = () => {
    try {
      const item = makeFreezerItem({ name, cubes, frozenOn });
      saveFreezerItem(item)
        .then(() => router.back())
        .catch(() => Alert.alert('Could not save', 'Please try again.'));
    } catch {
      Alert.alert('Add a name', 'Tell us what you froze, like "Sweet potato puree".');
    }
  };

  return (
    <Screen>
      <View className="gap-2">
        <AppText variant="label">Quick pick</AppText>
        <View className="flex-row flex-wrap gap-2">
          {freezable.map((r) => (
            <Chip
              key={r.id}
              label={`${r.emoji} ${r.title}`}
              selected={name === r.title}
              onPress={() => setName(r.title)}
            />
          ))}
        </View>
      </View>

      <TextField
        label="What did you freeze?"
        value={name}
        onChangeText={setName}
        maxLength={60}
        placeholder="For example, pea puree"
      />

      <View className="gap-2">
        <AppText variant="label">How many cubes?</AppText>
        <View className="flex-row items-center gap-5">
          <Step
            label="One fewer cube"
            glyph="−"
            onPress={() => setCubes((c) => Math.max(1, c - 1))}
          />
          <AppText
            variant="title"
            accessibilityLiveRegion="polite"
            accessibilityLabel={`${cubes} cubes`}
            className="min-w-12 text-center"
          >
            {cubes}
          </AppText>
          <Step
            label="One more cube"
            glyph="+"
            onPress={() => setCubes((c) => Math.min(500, c + 1))}
          />
        </View>
      </View>

      <DateField label="Frozen on" value={frozenOn} onChange={setFrozenOn} maximumDate={now} />

      <AppText variant="caption">
        Use frozen purees within 3 months. We&apos;ll show the date on your freezer list.
      </AppText>

      <Button label="Save" disabled={!name.trim()} onPress={save} />
    </Screen>
  );
}
