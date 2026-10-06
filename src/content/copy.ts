import disclaimersJson from './copy/disclaimers.json';
import { copyCollectionSchema, type CopyBlock } from './schemas';

// Parsed at import time so malformed content fails loudly in tests and dev.
export const disclaimers: CopyBlock[] = copyCollectionSchema.parse(disclaimersJson).blocks;

export function getDisclaimer(id: string): CopyBlock | undefined {
  return disclaimers.find((block) => block.id === id);
}
