import disclaimersJson from './copy/disclaimers.json';
import medicalDisclaimerJson from './copy/medical-disclaimer.json';
import {
  articleDisclaimerNote,
  chokingDisclaimer,
  disclaimers,
  getDisclaimer,
  medicalDisclaimer,
} from './copy';
import { copyCollectionSchema, PLACEHOLDER_MARKER } from './schemas';

describe('bundled content', () => {
  it('disclaimers match the schema', () => {
    expect(() => copyCollectionSchema.parse(disclaimersJson)).not.toThrow();
  });

  it('has unique ids', () => {
    const ids = disclaimers.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks unreviewed text visibly so it cannot ship by accident', () => {
    for (const block of disclaimers) {
      const hasMarker = block.body.includes(PLACEHOLDER_MARKER);
      expect(hasMarker).toBe(block.reviewStatus === 'placeholder');
    }
  });

  it('includes the core safety disclaimers', () => {
    expect(getDisclaimer('general')).toBeDefined();
    expect(getDisclaimer('worried')).toBeDefined();
  });

  it('has a medical disclaimer covering the required points', () => {
    expect(() => copyCollectionSchema.parse(medicalDisclaimerJson)).not.toThrow();
    expect(medicalDisclaimer.map((b) => b.id)).toEqual([
      'educational',
      'no-relationship',
      'consult',
      'allergy-safety',
      'emergency',
    ]);
    for (const block of [...medicalDisclaimer, articleDisclaimerNote]) {
      expect(block.body.includes(PLACEHOLDER_MARKER)).toBe(block.reviewStatus === 'placeholder');
    }
    expect(articleDisclaimerNote.body).toMatch(/911/);
    expect(chokingDisclaimer.body).toMatch(/911/);
  });
});
