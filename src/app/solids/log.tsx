import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { reactionAdvice } from '@/content/reactions';
import { quickFoods } from '@/content/solids-plan';
import { today, type IsoDate } from '@/domain/dates';
import { makeEntry, type Reaction } from '@/domain/food-log';
import { allergens, type Allergen } from '@/domain/profile';
import { allergenLabels } from '@/domain/profile-labels';
import { useFoodLog } from '@/features/solids/food-log-context';
import { ReactionAdviceView } from '@/features/solids/reaction-advice-view';
import { AppText, Button, Chip, DateField, OptionCard, Screen, SwitchRow, TextField } from '@/ui';

const reactionOptions: { id: Reaction; title: string; detail: string }[] = [
  { id: 'none', title: 'No reaction', detail: 'All good so far' },
  {
    id: 'mild',
    title: 'Something mild',
    detail: 'A rash, an upset tummy, or you just noticed something',
  },
  {
    id: 'concerning',
    title: 'Something worrying',
    detail: 'Swelling, breathing trouble, repeated vomiting',
  },
];

function isAllergen(value: string | undefined): value is Allergen {
  return !!value && (allergens as readonly string[]).includes(value);
}

export default function LogFoodScreen() {
  const params = useLocalSearchParams<{ allergen?: string }>();
  const { add } = useFoodLog();
  const preset = isAllergen(params.allergen) ? params.allergen : null;
  const presetFood = preset ? quickFoods.find((f) => f.allergen === preset) : undefined;

  const now = today();
  const [food, setFood] = useState(presetFood?.label ?? '');
  const [allergen, setAllergen] = useState<Allergen | null>(preset);
  const [date, setDate] = useState<IsoDate>(now);
  const [isNew, setIsNew] = useState(true);
  const [reaction, setReaction] = useState<Reaction>('none');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = food.trim().length > 0 && !saving;

  async function save() {
    setSaving(true);
    try {
      await add(makeEntry({ date, food, allergen, isNew, reaction, notes }));
      router.back();
    } catch {
      setSaving(false);
      Alert.alert('Could not save', 'Please check the food name and try again.');
    }
  }

  return (
    <Screen>
      <AppText variant="title">Log a food</AppText>

      <View className="gap-2">
        <AppText variant="label">Quick pick</AppText>
        <View className="flex-row flex-wrap gap-2">
          {quickFoods.map((f) => (
            <Chip
              key={f.id}
              label={`${f.emoji} ${f.label}`}
              selected={food === f.label}
              onPress={() => {
                setFood(f.label);
                setAllergen(f.allergen);
              }}
            />
          ))}
        </View>
      </View>

      <TextField
        label="Food"
        value={food}
        onChangeText={setFood}
        maxLength={80}
        placeholder="Or type any food"
        returnKeyType="done"
      />

      <View className="gap-2">
        <AppText variant="label">Contains a major allergen?</AppText>
        <View className="flex-row flex-wrap gap-2">
          <Chip label="None" selected={allergen === null} onPress={() => setAllergen(null)} />
          {allergens.map((a) => (
            <Chip
              key={a}
              label={allergenLabels[a]}
              selected={allergen === a}
              onPress={() => setAllergen(a)}
            />
          ))}
        </View>
      </View>

      <SwitchRow
        label="First time trying it"
        detail="New foods are easier to track one at a time"
        value={isNew}
        onChange={setIsNew}
      />

      <DateField label="Date" value={date} onChange={setDate} maximumDate={now} />

      <View className="gap-2" accessibilityRole="radiogroup">
        <AppText variant="label">Any reaction?</AppText>
        {reactionOptions.map((o) => (
          <OptionCard
            key={o.id}
            title={o.title}
            detail={o.detail}
            selected={reaction === o.id}
            onPress={() => setReaction(o.id)}
          />
        ))}
      </View>

      {reaction === 'concerning' ? (
        <ReactionAdviceView advice={reactionAdvice.concerning} urgent />
      ) : null}
      {reaction === 'mild' ? (
        <ReactionAdviceView advice={reactionAdvice.mild} urgent={false} />
      ) : null}

      <TextField
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        maxLength={500}
        placeholder="How it went, how much they ate…"
      />

      <Button label={saving ? 'Saving…' : 'Save'} disabled={!canSave} onPress={save} />
      <AppText variant="caption" className="text-center">
        Saved on this phone only.
      </AppText>
    </Screen>
  );
}
