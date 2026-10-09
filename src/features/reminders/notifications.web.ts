import type { PlannedReminder } from '@/domain/reminders';

/** The web preview can't schedule local notifications; settings still save. */
export const notificationsSupported = false;

export async function ensurePermission(): Promise<boolean> {
  return true;
}

export async function hasPermission(): Promise<boolean> {
  return false;
}

export async function syncReminders(_reminders: PlannedReminder[]): Promise<void> {}
