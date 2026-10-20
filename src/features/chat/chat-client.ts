import { parseChatDishes, type ChatDish, type ChatTurn } from '@/domain/chat';

export type ChatResult =
  | { ok: true; reply: string; dishes: ChatDish[] }
  | { ok: false; reason: 'busy' | 'too-many' | 'offline' | 'not-ready' };

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
      // Only the words go back to the server, not the dishes shown under an answer.
      body: JSON.stringify({ turns: turns.map(({ role, text }) => ({ role, text })), ageMonths }),
    });
    if (res.status === 429) {
      // Our own per-person limit, or the AI provider being busy for everyone.
      const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
      return { ok: false, reason: data?.error === 'too_many' ? 'too-many' : 'busy' };
    }
    if (res.status === 503) return { ok: false, reason: 'not-ready' };
    if (!res.ok) return { ok: false, reason: 'offline' };
    const data = (await res.json()) as { reply?: unknown; dishes?: unknown };
    return typeof data.reply === 'string'
      ? { ok: true, reply: data.reply, dishes: parseChatDishes(data.dishes) }
      : { ok: false, reason: 'offline' };
  } catch {
    return { ok: false, reason: 'offline' };
  }
}
