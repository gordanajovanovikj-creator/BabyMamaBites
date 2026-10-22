import type { ReminderSettings } from '@/domain/reminders';

/** Small app settings (reminders, disclaimer). SQLite on devices; localStorage on web. */
export type SettingsStore = {
  loadReminders(): Promise<ReminderSettings>;
  saveReminders(settings: ReminderSettings): Promise<void>;
  /** The date the medical disclaimer was accepted, or null if it hasn't been. */
  loadDisclaimerAccepted(): Promise<string | null>;
  saveDisclaimerAccepted(onDate: string): Promise<void>;
  /** The date the parent agreed to send Ask questions to the AI provider, or null. */
  loadChatConsent(): Promise<string | null>;
  saveChatConsent(onDate: string): Promise<void>;
  /**
   * When the last App Store check said the subscription ends (ISO timestamp), so a
   * subscriber isn't shown locked screens while the store is asked again. Null if none.
   */
  loadPremiumUntil(): Promise<string | null>;
  savePremiumUntil(until: string | null): Promise<void>;
  /** The date the app tour was first shown, or null if it hasn't been. */
  loadTourSeen(): Promise<string | null>;
  saveTourSeen(onDate: string): Promise<void>;
};
