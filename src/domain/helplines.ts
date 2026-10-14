/** US emergency and support lines the app can dial. */
export type Helpline = '911' | '988' | 'tlc-mama';

export const helplineDetails: Record<Helpline, { label: string; tel: string; sms?: string }> = {
  '911': { label: 'Call 911', tel: '911' },
  '988': { label: 'Call or text 988', tel: '988', sms: '988' },
  'tlc-mama': { label: 'Call 1-833-TLC-MAMA', tel: '18338526262', sms: '18338526262' },
};

/** The helplines a piece of text mentions, in a fixed order (911 first). */
export function helplinesIn(text: string): Helpline[] {
  const found: Helpline[] = [];
  if (/\b911\b/.test(text)) found.push('911');
  if (/\b988\b/.test(text)) found.push('988');
  if (/1-833-TLC-MAMA|1-833-852-6262/i.test(text)) found.push('tlc-mama');
  return found;
}
