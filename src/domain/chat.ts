import { z } from 'zod';

/** One message in the in-app chat. Kept in memory only: chats are not saved on the phone. */
export type ChatTurn = { role: 'user' | 'assistant'; text: string };

/** Limits that keep requests small and cheap; the server enforces them too. */
export const CHAT_LIMITS = { maxTurns: 20, maxChars: 2000 } as const;

export type ChatRequest = { turns: ChatTurn[]; ageMonths: number | null };

/** Checks a request body from the app. Returns null if it is not a valid chat request. */
export function parseChatRequest(body: unknown): ChatRequest | null {
  if (!body || typeof body !== 'object') return null;
  const { turns, ageMonths } = body as { turns?: unknown; ageMonths?: unknown };
  if (!Array.isArray(turns) || turns.length === 0 || turns.length > CHAT_LIMITS.maxTurns) {
    return null;
  }
  const clean: ChatTurn[] = [];
  for (const t of turns) {
    if (!t || typeof t !== 'object') return null;
    const { role, text } = t as { role?: unknown; text?: unknown };
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof text !== 'string') return null;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > CHAT_LIMITS.maxChars) return null;
    clean.push({ role, text: trimmed });
  }
  // The conversation must start and end with the mom's message, alternating in between.
  if (clean[0].role !== 'user' || clean[clean.length - 1].role !== 'user') return null;
  if (clean.some((t, i) => i > 0 && t.role === clean[i - 1].role)) return null;
  const age =
    typeof ageMonths === 'number' &&
    Number.isInteger(ageMonths) &&
    ageMonths >= 0 &&
    ageMonths <= 72
      ? ageMonths
      : null;
  return { turns: clean, ageMonths: age };
}

export type UrgentKind = 'emergency' | 'crisis';

const EMERGENCY = [
  /not breathing|stopped breathing|can'?t breathe|struggling to breathe/,
  /chok(ing|ed)/,
  /turn(ing|ed)? blue|blue lips/,
  /seizure|convuls/,
  /unconscious|unresponsive|won'?t wake|limp/,
  /swallowed (a )?(battery|magnet|button)/,
];

const CRISIS = [
  /suicid/,
  /kill (myself|me)/,
  /harm(ing)? (myself|my baby|the baby)/,
  /hurt(ing)? (myself|my baby|the baby)/,
  /end (it all|my life)/,
  /don'?t want to (live|be here)/,
];

/**
 * Spots messages that need a person, not a chatbot, so the app can show 911 / 988 right away.
 * Deliberately simple and over-inclusive; the assistant is also told to escalate.
 */
export function detectUrgent(text: string): UrgentKind | null {
  const t = text.toLowerCase();
  if (CRISIS.some((r) => r.test(t))) return 'crisis';
  if (EMERGENCY.some((r) => r.test(t))) return 'emergency';
  return null;
}

/** A dish the helper suggested, with a shopping-style ingredient list. */
export type ChatDish = { name: string; ingredients: string[] };

export const MAX_CHAT_DISHES = 4;

const dishSchema = z.object({
  name: z.string().trim().min(1).max(80),
  ingredients: z.array(z.string().trim().min(1).max(120)).min(1).max(30),
});

/**
 * The JSON shape the server asks the model for: the answer itself, plus any dishes it
 * suggested (empty when the answer isn't about specific dishes).
 */
export const chatOutputJsonSchema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    dishes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          ingredients: { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'ingredients'],
        additionalProperties: false,
      },
    },
  },
  required: ['reply', 'dishes'],
  additionalProperties: false,
} as const;

/**
 * Reads the model's JSON answer. Anything that isn't valid JSON becomes a plain reply with no
 * dishes, and dishes that don't fit the shape are dropped, so a bad answer never breaks Ask.
 */
export function parseChatOutput(text: string): { reply: string; dishes: ChatDish[] } {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { reply: text.trim(), dishes: [] };
  }
  const obj = (value ?? {}) as { reply?: unknown; dishes?: unknown };
  const reply = typeof obj.reply === 'string' ? obj.reply.trim() : '';
  const dishes = Array.isArray(obj.dishes)
    ? obj.dishes.flatMap((d) => {
        const r = dishSchema.safeParse(d);
        return r.success ? [r.data] : [];
      })
    : [];
  return { reply, dishes: dishes.slice(0, MAX_CHAT_DISHES) };
}

/** Checks dishes coming back from the server (or through a link) before showing them. */
export function parseChatDishes(value: unknown): ChatDish[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((d) => {
      const r = dishSchema.safeParse(d);
      return r.success ? [r.data] : [];
    })
    .slice(0, MAX_CHAT_DISHES);
}

/** A dish as one route parameter, for opening the shopping sheet. */
export function dishToParam(dish: ChatDish): string {
  return JSON.stringify(dish);
}

export function dishFromParam(param: string | undefined): ChatDish | null {
  if (!param) return null;
  try {
    return parseChatDishes([JSON.parse(param)])[0] ?? null;
  } catch {
    return null;
  }
}
