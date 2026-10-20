import { z } from 'zod';

import legalJson from './copy/legal.json';

const sectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  bullets: z.array(z.string().min(1)),
});

export const legalDocumentSchema = z.object({
  id: z.enum(['terms', 'privacy']),
  title: z.string().min(1),
  /** Shown as "Last updated". */
  updated: z.string().min(1),
  intro: z.string().min(1),
  sections: z.array(sectionSchema).min(1),
});
export type LegalDocument = z.infer<typeof legalDocumentSchema>;

const file = z
  .object({ version: z.number(), documents: z.array(legalDocumentSchema).min(1) })
  .parse(legalJson);

/** Terms of Use and Privacy Policy. */
export const legalDocuments: LegalDocument[] = file.documents;

export function getLegalDocument(id: string): LegalDocument | undefined {
  return legalDocuments.find((d) => d.id === id);
}
