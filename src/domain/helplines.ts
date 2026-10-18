/** US emergency and support lines the app can dial. */
export type Helpline = '911' | '988' | 'tlc-mama' | 'psi' | 'poison';

export const helplineDetails: Record<Helpline, { label: string; tel: string; sms?: string }> = {
  '911': { label: 'Call 911', tel: '911' },
  '988': { label: 'Call or text 988', tel: '988', sms: '988' },
  'tlc-mama': { label: 'Call 1-833-TLC-MAMA', tel: '18338526262', sms: '18338526262' },
  /** Postpartum Support International HelpLine (support, not a crisis line). */
  psi: { label: 'Call 1-800-944-4773', tel: '18009444773' },
  /** Poison Help line, free and open 24/7 anywhere in the US. */
  poison: { label: 'Call Poison Control', tel: '18002221222' },
};

/** The helplines a piece of text mentions, in a fixed order (911 first). */
export function helplinesIn(text: string): Helpline[] {
  const found: Helpline[] = [];
  if (/\b911\b/.test(text)) found.push('911');
  if (/\b988\b/.test(text)) found.push('988');
  if (/1-833-TLC-MAMA|1-833-852-6262/i.test(text)) found.push('tlc-mama');
  if (/1-800-944-4773/.test(text)) found.push('psi');
  if (/1-800-222-1222/.test(text)) found.push('poison');
  return found;
}
