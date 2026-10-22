import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';

import { today } from '@/domain/dates';
import {
  buildReport,
  reportFileName,
  reportHtml,
  reportPeriodLabels,
  reportPeriods,
  type PediatricianReport,
} from '@/domain/pediatrician-report';
import { useProfile } from '@/features/profile/profile-context';

import { useFoodLog } from './food-log-context';

/**
 * Turns the report into a PDF in the app's cache and opens the share sheet, so the family
 * can email, AirDrop, print or save it. Nothing leaves the phone unless they pick a target.
 */
export async function shareFoodLogReport(report: PediatricianReport): Promise<void> {
  const { uri } = await Print.printToFileAsync({ html: reportHtml(report) });
  const pdf = new File(uri);
  const named = new File(Paths.cache, `${reportFileName(report)}.pdf`);
  if (named.exists) named.delete();
  await pdf.move(named);
  await Sharing.shareAsync(named.uri, {
    UTI: 'com.adobe.pdf',
    mimeType: 'application/pdf',
    dialogTitle: 'Share food log',
  });
}

/**
 * "Share with your pediatrician": asks which period to include, then makes and shares the PDF.
 * `available` is false when there's nothing to share yet, or in the browser preview.
 */
export function useShareFoodLog() {
  const { entries } = useFoodLog();
  const { profile } = useProfile();
  const [sharing, setSharing] = useState(false);

  function share() {
    if (!profile) return;
    Alert.alert(
      'Share with your pediatrician',
      'Make a PDF of foods, allergens and any reactions to email, print or show at your next visit.',
      [
        ...reportPeriods.map((period) => ({
          text: reportPeriodLabels[period],
          onPress: () => {
            setSharing(true);
            shareFoodLogReport(buildReport(profile, entries, period, today()))
              .catch(() => Alert.alert("Couldn't make the PDF", 'Please try again.'))
              .finally(() => setSharing(false));
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  }

  return {
    available: entries.length > 0 && !!profile && Platform.OS !== 'web',
    sharing,
    share,
    label: sharing ? 'Making your PDF…' : 'Share with your pediatrician',
  };
}
