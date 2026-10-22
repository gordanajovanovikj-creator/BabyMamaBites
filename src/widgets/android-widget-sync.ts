import type { StoredWidgetDay } from '@/domain/widget';

/**
 * The Android widget lives in android-widget-sync.android.ts. Other platforms get this
 * stand-in, so their bundles never include the Android widget or its database code.
 */
export async function syncAndroidWidget(_days: StoredWidgetDay[]): Promise<void> {}
