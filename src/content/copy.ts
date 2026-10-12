import disclaimersJson from './copy/disclaimers.json';
import medicalDisclaimerJson from './copy/medical-disclaimer.json';
import { copyCollectionSchema, type CopyBlock } from './schemas';

// Parsed at import time so malformed content fails loudly in tests and dev.
export const disclaimers: CopyBlock[] = copyCollectionSchema.parse(disclaimersJson).blocks;

export function getDisclaimer(id: string): CopyBlock | undefined {
  return disclaimers.find((block) => block.id === id);
}

const medical = copyCollectionSchema.parse(medicalDisclaimerJson).blocks;

/** The full Medical and Health Information Disclaimer, section by section (legal menu). */
export const medicalDisclaimer: CopyBlock[] = medical.filter(
  (b) => b.id !== 'article-note' && b.id !== 'choking',
);

/** The short note shown at the bottom of health-related articles, guides and recipes. */
export const articleDisclaimerNote: CopyBlock = medical.find((b) => b.id === 'article-note')!;

/** The longer disclaimer at the bottom of the choking and gagging page. */
export const chokingDisclaimer: CopyBlock = medical.find((b) => b.id === 'choking')!;
