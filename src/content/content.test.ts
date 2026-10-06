import disclaimersJson from './copy/disclaimers.json';
import { disclaimers, getDisclaimer } from './copy';
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
});
