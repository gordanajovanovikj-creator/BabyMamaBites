import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { reportFileName, reportHtml, type PediatricianReport } from '@/domain/pediatrician-report';

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
