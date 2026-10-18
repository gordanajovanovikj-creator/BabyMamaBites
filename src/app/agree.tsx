import { DisclaimerAgreement } from '@/features/legal/disclaimer-agreement';

/**
 * For anyone who set up the app before the disclaimer step existed. Once accepted, the
 * app's screens unlock and the router moves on by itself.
 */
export default function AgreeScreen() {
  return <DisclaimerAgreement onAccepted={() => {}} />;
}
