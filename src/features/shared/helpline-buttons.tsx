import { Linking, View } from 'react-native';

import { helplineDetails, type Helpline } from '@/domain/helplines';
import { Button } from '@/ui';

const dial = (tel: string) => Linking.openURL(`tel:${tel}`).catch(() => {});

/** One-tap call buttons for the helplines a section mentions (911 is the strongest). */
export function HelplineButtons({ lines }: { lines: Helpline[] }) {
  if (!lines.length) return null;
  return (
    <View className="gap-2 pt-1">
      {lines.map((line, i) => (
        <Button
          key={line}
          label={helplineDetails[line].label}
          variant={i === 0 ? 'primary' : 'secondary'}
          onPress={() => dial(helplineDetails[line].tel)}
        />
      ))}
    </View>
  );
}
