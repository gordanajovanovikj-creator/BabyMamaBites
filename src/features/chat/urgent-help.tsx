import { Linking, View } from 'react-native';

import type { UrgentKind } from '@/domain/chat';
import { AppText, Button } from '@/ui';

const call = (number: string) => Linking.openURL(`tel:${number}`).catch(() => {});
const text = (number: string) => Linking.openURL(`sms:${number}`).catch(() => {});

/** Shown straight away when a message sounds like an emergency or a crisis. */
export function UrgentHelp({ kind }: { kind: UrgentKind }) {
  if (kind === 'emergency') {
    return (
      <View accessibilityRole="alert" className="gap-3 rounded-3xl bg-danger-bg p-5">
        <AppText variant="heading" color="danger">
          If your baby can&apos;t breathe, is choking, turning blue or hard to wake, call 911 now.
        </AppText>
        <Button label="Call 911" onPress={() => call('911')} />
      </View>
    );
  }
  return (
    <View accessibilityRole="alert" className="gap-3 rounded-3xl bg-danger-bg p-5">
      <AppText variant="heading" color="danger">
        You don&apos;t have to go through this alone.
      </AppText>
      <AppText color="danger">
        Talk to someone now, any time, day or night. If you or your baby are in danger, call 911.
      </AppText>
      <Button label="Call or text 988" onPress={() => call('988')} />
      <Button
        label="Maternal Mental Health Hotline: 1-833-TLC-MAMA"
        variant="secondary"
        onPress={() => call('18338526262')}
      />
      <Button label="Text 988 instead" variant="quiet" onPress={() => text('988')} />
    </View>
  );
}
