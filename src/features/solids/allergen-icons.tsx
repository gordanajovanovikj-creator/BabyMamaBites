import { Circle, Ellipse, G, Path } from 'react-native-svg';

import type { Allergen } from '@/domain/profile';

/**
 * Simple line drawings of the nine major US allergens, on a 24 x 24 grid,
 * stroked in the badge's foreground color.
 */
export function AllergenIcon({ allergen, color }: { allergen: Allergen; color: string }) {
  const line = {
    stroke: color,
    strokeWidth: 1.6,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (allergen) {
    case 'egg':
      return <Path {...line} d="M12 3C8.5 3 5.5 9 5.5 14a6.5 6.5 0 0 0 13 0C18.5 9 15.5 3 12 3z" />;
    case 'milk':
      return (
        <G {...line}>
          <Path d="M8 9l1.5-4h5L16 9v11H8z" />
          <Path d="M8 9h8M9.5 5V3h5v2" />
          <Path d="M10.5 13.5h3" />
        </G>
      );
    case 'peanut':
      return (
        <G {...line}>
          <Path d="M12 2.5a4.3 4.3 0 0 0-3.2 7.2c.5.6.5 1.4 0 2a4.6 4.6 0 1 0 6.4 0c-.5-.6-.5-1.4 0-2A4.3 4.3 0 0 0 12 2.5z" />
          <Path d="M10.5 6.5h.01M13.5 7.5h.01M10.5 16h.01M13.5 17h.01M12 14h.01" />
        </G>
      );
    case 'tree-nuts':
      return (
        <G {...line}>
          <Path d="M4.5 10.5C4.5 7.5 8 5.5 12 5.5s7.5 2 7.5 5z" />
          <Path d="M6 10.5c0 5 2.8 8.8 6 10 3.2-1.2 6-5 6-10" />
          <Path d="M12 5.5V3" />
        </G>
      );
    case 'sesame':
      return (
        <G {...line}>
          <Ellipse cx={8} cy={8} rx={2.2} ry={3.6} transform="rotate(-30 8 8)" />
          <Ellipse cx={16} cy={9} rx={2.2} ry={3.6} transform="rotate(25 16 9)" />
          <Ellipse cx={11.5} cy={16.5} rx={2.2} ry={3.6} transform="rotate(-5 11.5 16.5)" />
        </G>
      );
    case 'soy':
      return (
        <G {...line}>
          <Path d="M3.5 18.5C5 11 12 4.5 20.5 4.5c0 8-7 15.5-17 14z" />
          <Circle cx={8.5} cy={15} r={1.6} />
          <Circle cx={12.5} cy={11.5} r={1.6} />
          <Circle cx={16.2} cy={8} r={1.6} />
        </G>
      );
    case 'wheat':
      return (
        <G {...line}>
          <Path d="M12 21V4" />
          <Path d="M12 8c-2.5 0-4-1.8-4-4 2.5 0 4 1.8 4 4zM12 8c2.5 0 4-1.8 4-4-2.5 0-4 1.8-4 4z" />
          <Path d="M12 12.5c-2.5 0-4-1.8-4-4 2.5 0 4 1.8 4 4zM12 12.5c2.5 0 4-1.8 4-4-2.5 0-4 1.8-4 4z" />
          <Path d="M12 17c-2.5 0-4-1.8-4-4 2.5 0 4 1.8 4 4zM12 17c2.5 0 4-1.8 4-4-2.5 0-4 1.8-4 4z" />
        </G>
      );
    case 'fish':
      return (
        <G {...line}>
          <Path d="M2.5 12c3-4.5 8.5-5.5 13-2.5L21 6v12l-5.5-3.5c-4.5 3-10 2-13-2.5z" />
          <Path d="M7.5 11h.01" strokeWidth={2.4} />
        </G>
      );
    default:
      return (
        <G {...line}>
          <Path d="M6 5.5c7-2.5 14 1.5 14 8a5.5 5.5 0 0 1-5.5 5.5H10" />
          <Path d="M10 19l-3.5 2.5M10 19l-3.5-2.5" />
          <Path d="M11 7.5l2 4.5M15 9l.5 4.5M18 12.5l-2.5 3" />
          <Path d="M6 5.5L4 3M7.5 5L7 2.5" />
        </G>
      );
  }
}
