import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { calendarKinds, makeCalendarEntry, type CalendarKind } from '@/domain/calendar';
import { isIsoDate, today, type IsoDate } from '@/domain/dates';
import { useCalendar } from '@/features/calendar/calendar-context';
import { ensurePermission, notificationsSupported } from '@/features/reminders/notifications';
import { AppText, Button, DateField, Notice, Screen, SwitchRow, TextField, TimeField } from '@/ui';

function isKind(value: string | undefined): value is CalendarKind {
  return !!value && (calendarKinds as readonly string[]).includes(value);
}

/** Add or edit an event (with an optional time) or a note on a calendar day. */
export default function AddCalendarEntryScreen() {
  const params = useLocalSearchParams<{ date?: string; kind?: string; id?: string }>();
  const { entries, save, remove } = useCalendar();
  // Editing when opened with the id of an existing entry.
  const existing = params.id ? entries.find((e) => e.id === params.id) : undefined;
  const kind: CalendarKind = existing?.kind ?? (isKind(params.kind) ? params.kind : 'event');
  const [date, setDate] = useState<IsoDate>(
    existing?.date ?? (params.date && isIsoDate(params.date) ? params.date : today()),
  );
  const [text, setText] = useState(existing?.text ?? '');
  const [timed, setTimed] = useState(!!existing?.time);
  const [time, setTime] = useState(existing?.time ?? '09:00');
  const [remind, setRemind] = useState(existing?.remind ?? false);
  const [saving, setSaving] = useState(false);

  const isEvent = kind === 'event';
  const canSave = text.trim().length > 0 && !saving;

  async function submit() {
    setSaving(true);
    if (isEvent && remind && !(await ensurePermission().catch(() => false))) {
      setSaving(false);
      Alert.alert(
        'Notifications are turned off',
        'To get event reminders, allow notifications for MamaBabyBites in your iPhone Settings. You can still save the event without one.',
      );
      return;
    }
    try {
      const input = { date, kind, text, time: isEvent && timed ? time : null, remind };
      await save(existing ? makeCalendarEntry(input, existing.id) : makeCalendarEntry(input));
      router.back();
    } catch {
      setSaving(false);
      Alert.alert('Could not save', 'Please check what you typed and try again.');
    }
  }

  return (
    <Screen>
      <AppText variant="title">
        {existing ? (isEvent ? 'Edit event' : 'Edit note') : isEvent ? 'New event' : 'New note'}
      </AppText>
      <TextField
        label={isEvent ? 'What is happening?' : 'Your note'}
        value={text}
        onChangeText={setText}
        placeholder={isEvent ? 'e.g. Pediatrician checkup' : 'e.g. Loved the pear puree today'}
        maxLength={500}
        multiline={!isEvent}
        autoFocus={!existing}
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
          <SwitchRow
            label="Remind me"
            detail={
              timed
                ? "We'll send a notification at the event time."
                : "We'll send a notification at 9 AM that day."
            }
            value={remind}
            onChange={setRemind}
          />
          {remind && !notificationsSupported ? (
            <Notice body="Reminders work on iPhone. In this web preview the event is saved, but no notification is sent." />
          ) : null}
        </>
      ) : null}
      <Button label={saving ? 'Saving…' : 'Save'} disabled={!canSave} onPress={submit} />
      {existing ? (
        <Button
          label={isEvent ? 'Delete event' : 'Delete note'}
          variant="quiet"
          disabled={saving}
          onPress={() =>
            remove(existing.id)
              .then(() => router.back())
              .catch(() => Alert.alert('Could not delete', 'Please try again.'))
          }
        />
      ) : null}
    </Screen>
  );
}
