import Svg, { Path } from 'react-native-svg';

import type { IllustrationName } from '@/content/illustration-names';
import { illustrationPalette } from '@/theme/illustration-palette';

import { drawings, VIEWBOX } from './drawings';

export type IllustrationProps = {
  name: IllustrationName;
  /** Height in points; width follows the 4:3 canvas. */
  height?: number;
  /**
   * The card color behind it: 'white' tints the blob so it stays visible, 'dark' keeps it
   * subtle on deep plum cards. Defaults to a soft white blob for pastel cards.
   */
  on?: 'pastel' | 'white' | 'dark';
};

/** A soft, flat vector illustration on an organic blob. Decorative: hidden from VoiceOver. */
export function Illustration({ name, height = 96, on = 'pastel' }: IllustrationProps) {
  const c = illustrationPalette.light;
  return (
    <Svg
      viewBox={VIEWBOX}
      width={(height * 4) / 3}
      height={height}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d="M80 8 C118 6 146 30 148 62 C150 96 120 116 82 114 C44 112 12 96 12 62 C12 30 42 10 80 8 Z"
        fill={on === 'white' ? c.blobOnWhite : c.blob}
        opacity={on === 'white' ? 1 : on === 'dark' ? c.blobOnDarkOpacity : c.blobOpacity}
      />
      {drawings[name](c)}
    </Svg>
  );
}
