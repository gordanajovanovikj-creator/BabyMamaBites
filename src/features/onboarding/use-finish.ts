import { router } from 'expo-router';
import { useState } from 'react';

import { useProfile } from '@/features/profile/profile-context';

import { draftToProfile, useDraft } from './draft-context';

/** Saves the answers and leaves onboarding. Used by whichever screen ends the flow. */
export function useFinishOnboarding() {
  const { draft } = useDraft();
  const { saveProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const profile = draftToProfile(draft);

  const finish = async () => {
    if (!profile) return;
    setSaving(true);
    setFailed(false);
    try {
      await saveProfile(profile);
      router.dismissTo('/');
    } catch {
      setFailed(true);
      setSaving(false);
    }
  };

  return { canFinish: !!profile, saving, failed, finish };
}
