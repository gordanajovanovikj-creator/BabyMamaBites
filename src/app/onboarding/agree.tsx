import { router } from 'expo-router';

import { DisclaimerAgreement } from '@/features/legal/disclaimer-agreement';

/** Onboarding: accept the medical and nutritional disclaimer before reminders and the trial. */
export default function AgreeScreen() {
  return <DisclaimerAgreement onAccepted={() => router.push('/onboarding/notifications')} />;
}
