import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { calendarKinds, makeCalendarEntry, type CalendarKind } from '@/domain/calendar';
import { isIsoDate, today, type IsoDate } from '@/domain/dates';
import { useCalendar } from '@/features/calendar/calendar-context';
import { AppText, Button, DateField, Screen, SwitchRow, TextField, TimeField } from '@/ui';

function isKind(value: string | undefined): value is CalendarKind {
  return !!value && (calendarKinds as readonly string[]).includes(value);
}

/** Add an event (with an optional time) or a note to a calendar day. */
export default function AddCalendarEntryScreen() {
  const params = useLocalSearchParams<{ date?: string; kind?: string }>();
  const { save } = useCalendar();
  const kind: CalendarKind = isKind(params.kind) ? params.kind : 'event';
  const [date, setDate] = useState<IsoDate>(
    params.date && isIsoDate(params.date) ? params.date : today(),
  );
  const [text, setText] = useState('');
  const [timed, setTimed] = useState(false);
  const [time, setTime] = useState('09:00');
  const [saving, setSaving] = useState(false);

  const isEvent = kind === 'event';
  const canSave = text.trim().length > 0 && !saving;

  async function submit() {
    setSaving(true);
    try {
      await save(makeCalendarEntry({ date, kind, text, time: isEvent && timed ? time : null }));
      router.back();
    } catch {
      setSaving(false);
      Alert.alert('Could not save', 'Please check what you typed and try again.');
    }
  }

  return (
    <Screen>
      <AppText variant="title">{isEvent ? 'New event' : 'New note'}</AppText>
      <TextField
        label={isEvent ? 'What is happening?' : 'Your note'}
        value={text}
        onChangeText={setText}
        placeholder={isEvent ? 'e.g. Pediatrician checkup' : 'e.g. Loved the pear puree today'}
        maxLength={500}
        multiline={!isEvent}
        autoFocus
      />
      <DateField label="Date" value={date} onChange={setDate} />
      {isEvent ? (
        <>
          <SwitchRow
            label="Set a time"
            detail="Leave off for an all-day event."
            value={timed}
            onChange={setTimed}
          />
          {timed ? <TimeField label="Time" value={time} onChange={setTime} /> : null}
        </>
      ) : null}
      <Button label={saving ? 'Saving…' : 'Save'} disabled={!canSave} onPress={submit} />
    </Screen>
  );
}
