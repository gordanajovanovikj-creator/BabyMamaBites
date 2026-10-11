import Anthropic from '@anthropic-ai/sdk';

import { CHAT_SYSTEM_PROMPT } from '@/content/chat-prompt';
import { parseChatRequest } from '@/domain/chat';

/** Server-only. Reads ANTHROPIC_API_KEY from the host's environment (never bundled in the app). */
let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

const MODEL = 'claude-opus-5-5';

/** POST /api/chat: { turns, ageMonths } → { reply } */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const chat = parseChatRequest(body);
  if (!chat) return Response.json({ error: 'invalid_request' }, { status: 400 });
  const anthropic = getClient();
  if (!anthropic) {
    console.error('Chat: ANTHROPIC_API_KEY is not set on the server');
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }

  const context =
    chat.ageMonths === null
      ? 'Context: baby age unknown.'
      : `Context: the baby is ${chat.ageMonths} months old.`;

  const messages: Anthropic.Beta.BetaMessageParam[] = chat.turns.map((t, i) => ({
    role: t.role,
    content: i === 0 ? `${context}\n\n${t.text}` : t.text,
  }));

  try {
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      // Chat answers are short and everyday: low effort keeps them quick and inexpensive.
      output_config: { effort: 'low' },
      // If a safety classifier declines, the API retries on a suitable model in the same call.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: CHAT_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return Response.json({
        reply:
          "I can't help with that one. For health worries, please talk to your pediatrician or doctor, and call 911 in an emergency.",
      });
    }
    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return Response.json({ reply: reply || "Sorry, I didn't catch that. Could you ask again?" });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'busy' }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Chat: ANTHROPIC_API_KEY is missing or invalid');
      return Response.json({ error: 'unavailable' }, { status: 503 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Chat: API error ${error.status}`);
      return Response.json({ error: 'unavailable' }, { status: 502 });
    }
    console.error('Chat: unexpected error', (error as Error)?.name);
    return Response.json({ error: 'unavailable' }, { status: 500 });
  }
}
