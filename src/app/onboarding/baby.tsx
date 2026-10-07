import { router } from 'expo-router';

import { today } from '@/domain/dates';
import {
  BABY_NAME_MAX,
  dueDateBounds,
  oldestBirthDate,
  validateBirthDate,
  validateDueDate,
} from '@/domain/profile';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { DateField, Notice, SwitchRow, TextField } from '@/ui';

const birthErrors = {
  'in-future': "That date is in the future. If baby isn't here yet, come back after the birth.",
  'too-old': 'That date is more than five years ago. Please check it.',
  'out-of-range': '',
} as const;

export default function BabyStep() {
  const { draft, update } = useDraft();
  const now = today();
  const birthDate = draft.birthDate ?? now;
  const bounds = dueDateBounds(birthDate);
  const dueDate = draft.dueDate ?? birthDate;

  const birthError = validateBirthDate(birthDate, now);
  const dueError = draft.bornEarly ? validateDueDate(dueDate, birthDate) : null;

  return (
    <StepScreen
      step={1}
      title="Tell us about your baby"
      subtitle="We use the birth date to show what fits your baby's age right now."
      canContinue={!birthError && !dueError}
      onContinue={() => {
        update({ birthDate, dueDate: draft.bornEarly ? dueDate : null });
        router.push('/onboarding/feeding');
      }}
    >
      <TextField
        label="Baby's name (optional)"
        value={draft.babyName}
        onChangeText={(text) => update({ babyName: text })}
        placeholder="First name or nickname"
        maxLength={BABY_NAME_MAX}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
      />
      <DateField
        label="Birth date"
        value={birthDate}
        minimumDate={oldestBirthDate(now)}
        maximumDate={now}
        onChange={(d) => update({ birthDate: d })}
      />
      {birthError ? <Notice tone="caution" body={birthErrors[birthError]} /> : null}

      <SwitchRow
        label="Baby arrived early"
        detail="Add the original due date and we'll go by your baby's adjusted age."
        value={draft.bornEarly}
        onChange={(on) => update({ bornEarly: on, dueDate: on ? dueDate : null })}
      />
      {draft.bornEarly ? (
        <DateField
          label="Original due date"
          value={dueDate}
          minimumDate={bounds.min}
          maximumDate={bounds.max}
          onChange={(d) => update({ dueDate: d })}
        />
      ) : null}
      {dueError ? (
        <Notice
          tone="caution"
          body="That due date looks far from the birth date. Please check it."
        />
      ) : null}
    </StepScreen>
  );
}
