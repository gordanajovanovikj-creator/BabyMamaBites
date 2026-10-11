import type { ChatTurn } from '@/domain/chat';

export type ChatResult =
  { ok: true; reply: string } | { ok: false; reason: 'busy' | 'offline' | 'not-ready' };

/**
 * Sends the conversation to the app's own server, which talks to the AI model.
 * In development this reaches the Expo dev server; in production it uses the `origin`
 * set on the expo-router plugin in app.json.
 */
export async function sendChat(turns: ChatTurn[], ageMonths: number | null): Promise<ChatResult> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turns, ageMonths }),
    });
    if (res.status === 429) return { ok: false, reason: 'busy' };
    if (res.status === 503) return { ok: false, reason: 'not-ready' };
    if (!res.ok) return { ok: false, reason: 'offline' };
    const data = (await res.json()) as { reply?: unknown };
    return typeof data.reply === 'string'
      ? { ok: true, reply: data.reply }
      : { ok: false, reason: 'offline' };
  } catch {
    return { ok: false, reason: 'offline' };
  }
}
