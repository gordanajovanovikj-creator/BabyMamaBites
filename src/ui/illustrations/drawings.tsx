import type { ReactElement } from 'react';
import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import type { IllustrationName } from '@/content/illustration-names';
import type { IllustrationPalette } from '@/theme/illustration-palette';

/** All drawings share a 160 × 120 canvas. */
export const VIEWBOX = '0 0 160 120';

type Drawing = (c: IllustrationPalette) => ReactElement;

/** A small heart centered on (x, y) with half-width s. */
function heart(x: number, y: number, s: number): string {
  return (
    `M${x} ${y + s * 0.9} ` +
    `C${x - s * 1.4} ${y} ${x - s * 0.9} ${y - s * 1.1} ${x} ${y - s * 0.35} ` +
    `C${x + s * 0.9} ${y - s * 1.1} ${x + s * 1.4} ${y} ${x} ${y + s * 0.9} Z`
  );
}

/** A four-point sparkle centered on (x, y). */
function sparkle(x: number, y: number, s: number): string {
  return `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`;
}

function Spoon({
  x,
  y,
  angle,
  c,
}: {
  x: number;
  y: number;
  angle: number;
  c: IllustrationPalette;
}) {
  return (
    <G transform={`rotate(${angle} ${x} ${y})`}>
      <Rect x={x - 3} y={y} width={6} height={34} rx={3} fill={c.lavenderDeep} />
      <Ellipse cx={x} cy={y - 6} rx={9} ry={12} fill={c.lavenderDeep} />
      <Ellipse cx={x} cy={y - 7} rx={5.5} ry={8} fill={c.lavender} />
    </G>
  );
}

export const drawings: Record<IllustrationName, Drawing> = {
  checklist: (c) => (
    <G>
      <Rect x={48} y={18} width={64} height={88} rx={12} fill={c.white} />
      <Rect x={66} y={11} width={28} height={14} rx={6} fill={c.rose} />
      {[40, 60, 80].map((y, i) => (
        <G key={y}>
          <Circle cx={63} cy={y} r={7} fill={i < 2 ? c.mint : c.lavender} />
          {i < 2 ? (
            <Path
              d={`M59.5 ${y} l2.5 3 l5 -6`}
              stroke={c.leaf}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}
          <Rect x={75} y={y - 3} width={26} height={6} rx={3} fill={c.lavender} />
        </G>
      ))}
      <Path d={sparkle(124, 32, 7)} fill={c.butter} />
      <Path d={sparkle(36, 86, 5)} fill={c.roseSoft} />
    </G>
  ),

  'high-chair': (c) => (
    <G>
      <Line
        x1={66}
        y1={62}
        x2={52}
        y2={106}
        stroke={c.brown}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <Line
        x1={98}
        y1={62}
        x2={112}
        y2={106}
        stroke={c.brown}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <Line
        x1={58}
        y1={88}
        x2={106}
        y2={88}
        stroke={c.brown}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Rect x={92} y={18} width={14} height={46} rx={7} fill={c.rose} />
      <Rect x={58} y={52} width={48} height={12} rx={6} fill={c.rose} />
      <Rect x={44} y={44} width={34} height={7} rx={3.5} fill={c.roseSoft} />
      <Path d="M52 44 a9 7 0 0 0 18 0 z" fill={c.lavenderDeep} />
      <Ellipse cx={61} cy={44} rx={9} ry={2} fill={c.carrot} />
      <Path d={heart(99, 33, 4)} fill={c.white} />
      <Path d={sparkle(124, 30, 6)} fill={c.butter} />
    </G>
  ),

  'bowl-and-spoon': (c) => (
    <G>
      <Path d="M36 62 h80 a40 34 0 0 1 -80 0 z" fill={c.skyDeep} />
      <Ellipse cx={76} cy={62} rx={40} ry={9} fill={c.sky} />
      <Ellipse cx={76} cy={61} rx={33} ry={6} fill={c.carrot} />
      <Ellipse cx={68} cy={59.5} rx={8} ry={2} fill={c.butter} opacity={0.8} />
      <Spoon x={118} y={44} angle={28} c={c} />
      <Rect x={112} y={90} width={12} height={12} rx={3} fill={c.mint} />
      <Rect x={128} y={84} width={11} height={11} rx={3} fill={c.butter} />
      <Path d={sparkle(30, 36, 6)} fill={c.roseSoft} />
    </G>
  ),

  veggies: (c) => (
    <G>
      <G transform="rotate(-18 62 70)">
        <Path d="M54 40 C60 34 72 34 76 40 L68 102 C66 108 62 108 60 102 Z" fill={c.carrot} />
        <Line
          x1={60}
          y1={56}
          x2={67}
          y2={56}
          stroke={c.white}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Line
          x1={62}
          y1={72}
          x2={69}
          y2={72}
          stroke={c.white}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Ellipse cx={58} cy={30} rx={5} ry={11} fill={c.leaf} transform="rotate(-20 58 30)" />
        <Ellipse cx={68} cy={28} rx={5} ry={12} fill={c.leaf} />
        <Ellipse cx={77} cy={31} rx={5} ry={10} fill={c.leaf} transform="rotate(25 77 31)" />
      </G>
      <Rect x={96} y={66} width={14} height={36} rx={7} fill={c.mint} />
      <Circle cx={92} cy={60} r={13} fill={c.leaf} />
      <Circle cx={106} cy={52} r={15} fill={c.leaf} />
      <Circle cx={119} cy={62} r={12} fill={c.leaf} />
      <Circle cx={104} cy={66} r={11} fill={c.leaf} />
      <Circle cx={128} cy={98} r={5} fill={c.leaf} />
      <Circle cx={138} cy={94} r={5} fill={c.leaf} />
      <Circle cx={134} cy={104} r={5} fill={c.leaf} />
    </G>
  ),

  'egg-and-peanut': (c) => (
    <G>
      <Ellipse cx={62} cy={66} rx={24} ry={30} fill={c.cream} />
      <Ellipse cx={55} cy={56} rx={6} ry={9} fill={c.white} opacity={0.8} />
      <G transform="rotate(-30 106 66)">
        <Ellipse cx={106} cy={52} rx={15} ry={16} fill={c.honey} />
        <Ellipse cx={106} cy={80} rx={15} ry={16} fill={c.honey} />
        <Rect x={95} y={56} width={22} height={20} fill={c.honey} />
        {[48, 58, 76, 86].map((y) => (
          <Circle
            key={y}
            cx={102 + (y % 20 === 8 ? 8 : 0)}
            cy={y}
            r={1.8}
            fill={c.brown}
            opacity={0.6}
          />
        ))}
      </G>
      <Path d={heart(128, 30, 8)} fill={c.rose} />
      <Path d={sparkle(32, 30, 6)} fill={c.lavender} />
    </G>
  ),

  'first-aid': (c) => (
    <G>
      <Rect
        x={68}
        y={26}
        width={24}
        height={16}
        rx={6}
        fill="none"
        stroke={c.roseDeep}
        strokeWidth={5}
      />
      <Rect x={42} y={38} width={76} height={60} rx={12} fill={c.rose} />
      <Rect x={74} y={50} width={12} height={36} rx={3} fill={c.white} />
      <Rect x={62} y={62} width={36} height={12} rx={3} fill={c.white} />
      <Path d={sparkle(130, 34, 7)} fill={c.butter} />
      <Path d={sparkle(30, 90, 5)} fill={c.lavender} />
    </G>
  ),

  bib: (c) => (
    <G>
      <Path
        d="M80 22 C66 22 58 32 58 42 L46 42 C46 80 60 104 80 104 C100 104 114 80 114 42 L102 42 C102 32 94 22 80 22 Z"
        fill={c.lavender}
      />
      <Circle cx={80} cy={42} r={12} fill={c.white} opacity={0.9} />
      <Path d={heart(80, 74, 12)} fill={c.rose} />
      <Path d={sparkle(128, 40, 6)} fill={c.butter} />
      <Path d={sparkle(34, 76, 5)} fill={c.roseSoft} />
    </G>
  ),

  cups: (c) => (
    <G>
      <Rect x={40} y={50} width={36} height={50} rx={9} fill={c.sky} />
      <Rect x={32} y={60} width={10} height={22} rx={5} fill={c.skyDeep} />
      <Rect x={74} y={60} width={10} height={22} rx={5} fill={c.skyDeep} />
      <Rect x={38} y={42} width={40} height={13} rx={6} fill={c.skyDeep} />
      <Path d="M52 42 L56 26 h6 L66 42 z" fill={c.skyDeep} />
      <Path d={heart(58, 76, 7)} fill={c.white} />
      <Path d="M94 44 h32 l-5 56 h-22 z" fill={c.white} opacity={0.9} />
      <Path d="M97 62 h26 l-3.4 36 h-19.2 z" fill={c.sky} />
      <Line
        x1={116}
        y1={24}
        x2={110}
        y2={70}
        stroke={c.rose}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </G>
  ),

  'freezer-tray': (c) => (
    <G>
      <Rect x={30} y={52} width={100} height={46} rx={10} fill={c.sky} />
      {[
        [c.carrot, c.mint, c.lavender, c.butter],
        [c.roseSoft, c.leaf, c.carrot, c.lavenderDeep],
      ].map((row, r) =>
        row.map((fill, i) => (
          <Rect
            key={`${r}-${i}`}
            x={38 + i * 22}
            y={58 + r * 19}
            width={18}
            height={15}
            rx={4}
            fill={fill}
          />
        )),
      )}
      <G stroke={c.skyDeep} strokeWidth={3} strokeLinecap="round">
        <Line x1={118} y1={20} x2={118} y2={44} />
        <Line x1={107.6} y1={26} x2={128.4} y2={38} />
        <Line x1={107.6} y1={38} x2={128.4} y2={26} />
      </G>
      <Path d={sparkle(40, 32, 6)} fill={c.white} />
    </G>
  ),

  'no-honey': (c) => (
    <G>
      <Rect x={58} y={46} width={44} height={50} rx={12} fill={c.honey} />
      <Rect x={60} y={38} width={40} height={12} rx={5} fill={c.brown} />
      <Rect x={66} y={62} width={28} height={18} rx={4} fill={c.cream} />
      <Path
        d="M70 50 q4 8 0 12"
        stroke={c.butter}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={80} cy={66} r={42} fill="none" stroke={c.rose} strokeWidth={7} />
      <Line
        x1={51}
        y1={95}
        x2={109}
        y2={37}
        stroke={c.rose}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </G>
  ),

  'smiley-plate': (c) => (
    <G>
      <Circle cx={78} cy={64} r={44} fill={c.white} />
      <Circle cx={78} cy={64} r={34} fill={c.cream} />
      <Circle cx={66} cy={56} r={6} fill={c.leaf} />
      <Circle cx={90} cy={56} r={6} fill={c.leaf} />
      <Path
        d="M62 72 Q78 90 94 72"
        stroke={c.carrot}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={60} cy={70} r={4} fill={c.roseSoft} opacity={0.8} />
      <Circle cx={96} cy={70} r={4} fill={c.roseSoft} opacity={0.8} />
      <Rect x={130} y={36} width={6} height={60} rx={3} fill={c.lavenderDeep} />
      <Path
        d="M126 24 v16 a7 7 0 0 0 14 0 v-16"
        stroke={c.lavenderDeep}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  ),

  milk: (c) => (
    <G>
      <Path
        d="M68 30 h24 v12 l9 12 v42 a8 8 0 0 1 -8 8 h-26 a8 8 0 0 1 -8 -8 v-42 l9 -12 z"
        fill={c.white}
      />
      <Rect x={66} y={22} width={28} height={11} rx={4} fill={c.skyDeep} />
      <Rect x={63} y={62} width={34} height={22} rx={5} fill={c.sky} />
      <Path d={heart(80, 72, 6)} fill={c.white} />
      <Path d="M110 58 h26 l-4 42 h-18 z" fill={c.white} opacity={0.9} />
      <Path d="M111.4 68 h23.2 l-3.1 30 h-17 z" fill={c.cream} />
      <Path d={sparkle(36, 40, 6)} fill={c.butter} />
    </G>
  ),

  'snack-basket': (c) => (
    <G>
      <Path
        d="M48 64 Q80 12 112 64"
        stroke={c.brown}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={64} cy={58} r={13} fill={c.rose} />
      <Ellipse cx={66} cy={44} rx={3} ry={6} fill={c.leaf} transform="rotate(30 66 44)" />
      <Circle cx={96} cy={56} r={12} fill={c.carrot} />
      <Path d="M70 60 Q84 38 102 44 Q90 52 80 64 z" fill={c.butter} />
      <Path d="M38 62 h84 l-9 36 a7 7 0 0 1 -7 5 h-52 a7 7 0 0 1 -7 -5 z" fill={c.brown} />
      <G stroke={c.white} strokeWidth={2} opacity={0.35}>
        <Line x1={44} y1={74} x2={116} y2={74} />
        <Line x1={47} y1={86} x2={113} y2={86} />
        <Line x1={64} y1={62} x2={62} y2={103} />
        <Line x1={80} y1={62} x2={80} y2={103} />
        <Line x1={96} y1={62} x2={98} y2={103} />
      </G>
    </G>
  ),

  casserole: (c) => (
    <G>
      <Path
        d="M68 30 q-6 -8 0 -16"
        stroke={c.roseSoft}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M80 28 q-6 -8 0 -16"
        stroke={c.roseSoft}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M92 30 q-6 -8 0 -16"
        stroke={c.roseSoft}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Rect x={30} y={60} width={14} height={10} rx={5} fill={c.roseDeep} />
      <Rect x={116} y={60} width={14} height={10} rx={5} fill={c.roseDeep} />
      <Rect x={40} y={54} width={80} height={44} rx={12} fill={c.rose} />
      <Path d="M38 56 Q80 28 122 56 z" fill={c.roseSoft} />
      <Circle cx={80} cy={40} r={5} fill={c.roseDeep} />
      <Path d={heart(80, 74, 10)} fill={c.white} />
    </G>
  ),

  'oats-jar': (c) => (
    <G>
      <Rect x={54} y={30} width={52} height={70} rx={14} fill={c.white} opacity={0.9} />
      <Rect x={58} y={64} width={44} height={32} rx={10} fill={c.cream} />
      <Rect x={58} y={52} width={44} height={14} fill={c.lavender} />
      <Circle cx={68} cy={48} r={5} fill={c.lavenderDeep} />
      <Circle cx={80} cy={46} r={5} fill={c.rose} />
      <Circle cx={92} cy={48} r={5} fill={c.lavenderDeep} />
      <Rect x={52} y={22} width={56} height={12} rx={5} fill={c.lavender} />
      <Spoon x={124} y={58} angle={18} c={c} />
    </G>
  ),

  'water-bottle': (c) => (
    <G>
      <Rect x={60} y={36} width={40} height={66} rx={14} fill={c.sky} />
      <Rect x={65} y={58} width={30} height={40} rx={10} fill={c.skyDeep} opacity={0.55} />
      <Rect x={68} y={22} width={24} height={17} rx={5} fill={c.skyDeep} />
      <Rect x={66} y={44} width={6} height={18} rx={3} fill={c.white} opacity={0.6} />
      <Path
        d="M122 36 C122 36 112 50 112 56 a10 10 0 0 0 20 0 C132 50 122 36 122 36 Z"
        fill={c.sky}
      />
      <Path d="M38 62 C38 62 31 72 31 76 a7 7 0 0 0 14 0 C45 72 38 62 38 62 Z" fill={c.sky} />
    </G>
  ),

  moon: (c) => (
    <G>
      <Path d="M86 22 A36 36 0 1 0 116 76 A28 28 0 1 1 86 22 Z" fill={c.butter} />
      <Path d={sparkle(118, 30, 7)} fill={c.white} />
      <Path d={sparkle(40, 38, 5)} fill={c.white} />
      <Circle cx={128} cy={52} r={2.5} fill={c.white} />
      <Ellipse cx={80} cy={100} rx={46} ry={10} fill={c.lavender} />
      <Ellipse cx={58} cy={94} rx={18} ry={9} fill={c.lavender} />
      <Ellipse cx={100} cy={94} rx={20} ry={10} fill={c.lavender} />
    </G>
  ),

  hearts: (c) => (
    <G>
      <Path d={heart(70, 50, 28)} fill={c.rose} />
      <Path d={heart(112, 70, 16)} fill={c.roseSoft} />
      <Path d={heart(64, 44, 6)} fill={c.white} opacity={0.5} />
      <Path d={sparkle(124, 34, 7)} fill={c.butter} />
      <Path d={sparkle(34, 92, 5)} fill={c.lavender} />
    </G>
  ),

  'baby-food-jar': (c) => (
    <G>
      <Rect x={56} y={44} width={48} height={56} rx={12} fill={c.white} opacity={0.9} />
      <Rect x={60} y={56} width={40} height={40} rx={9} fill={c.carrot} />
      <Rect x={54} y={34} width={52} height={14} rx={6} fill={c.mint} />
      <Rect x={66} y={68} width={28} height={16} rx={4} fill={c.white} />
      <Path d={heart(80, 74, 5)} fill={c.rose} />
      <Spoon x={124} y={60} angle={20} c={c} />
      <Path d={sparkle(36, 40, 6)} fill={c.butter} />
    </G>
  ),

  'two-textures': (c) => (
    <G>
      <Circle cx={80} cy={64} r={44} fill={c.white} />
      <Path d="M78 30 A34 34 0 0 0 78 98 Z" fill={c.carrot} />
      <Ellipse cx={64} cy={52} rx={6} ry={3} fill={c.butter} opacity={0.7} />
      {[
        [88, 44, c.leaf],
        [102, 52, c.carrot],
        [90, 62, c.butter],
        [104, 70, c.leaf],
        [88, 80, c.lavenderDeep],
        [100, 86, c.carrot],
      ].map(([x, y, fill]) => (
        <Rect
          key={`${x}-${y}`}
          x={x as number}
          y={y as number}
          width={9}
          height={9}
          rx={2.5}
          fill={fill as string}
        />
      ))}
    </G>
  ),

  'share-plates': (c) => (
    <G>
      <Circle cx={64} cy={60} r={38} fill={c.white} />
      <Circle cx={64} cy={60} r={28} fill={c.cream} />
      <Ellipse cx={56} cy={54} rx={12} ry={8} fill={c.carrot} />
      <Circle cx={74} cy={66} r={8} fill={c.leaf} />
      <Rect x={50} y={66} width={14} height={8} rx={4} fill={c.butter} />
      <Circle cx={118} cy={84} r={22} fill={c.white} />
      <Circle cx={118} cy={84} r={15} fill={c.cream} />
      <Rect x={110} y={78} width={6} height={6} rx={2} fill={c.carrot} />
      <Rect x={120} y={80} width={6} height={6} rx={2} fill={c.leaf} />
      <Rect x={114} y={88} width={6} height={6} rx={2} fill={c.butter} />
      <Path d={heart(118, 40, 8)} fill={c.rose} />
    </G>
  ),
  blender: (c) => (
    <G>
      <Path d="M54 26 h52 l-8 58 h-36 z" fill={c.white} opacity={0.9} />
      <Path d="M57 50 h46 l-4.7 34 h-36.6 z" fill={c.leaf} />
      <Ellipse cx={80} cy={50} rx={23} ry={4} fill={c.mint} />
      <Rect x={52} y={20} width={56} height={10} rx={5} fill={c.lavenderDeep} />
      <Path
        d="M106 34 h8 a6 6 0 0 1 6 6 v20 a6 6 0 0 1 -6 6 h-10"
        stroke={c.white}
        strokeWidth={5}
        fill="none"
        opacity={0.9}
      />
      <Rect x={56} y={84} width={48} height={22} rx={8} fill={c.lavenderDeep} />
      <Circle cx={80} cy={95} r={5} fill={c.lavender} />
      <Path d={sparkle(34, 40, 6)} fill={c.butter} />
      <Path d={sparkle(130, 88, 5)} fill={c.roseSoft} />
    </G>
  ),

  'toddler-face': (c) => (
    <G>
      <Circle cx={74} cy={66} r={34} fill={c.cream} />
      <Path d="M48 52 C52 30 92 26 102 50 C92 42 70 40 48 52 Z" fill={c.brown} />
      <Path
        d="M70 30 q4 -10 12 -6"
        stroke={c.brown}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M60 66 q5 -4 10 0"
        stroke={c.brown}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M80 66 q5 -4 10 0"
        stroke={c.brown}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={58} cy={76} r={5} fill={c.roseSoft} opacity={0.8} />
      <Circle cx={92} cy={76} r={5} fill={c.roseSoft} opacity={0.8} />
      <Path
        d="M68 86 q7 -5 14 0"
        stroke={c.roseDeep}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Rect x={122} y={70} width={8} height={26} rx={4} fill={c.mint} />
      <Circle cx={120} cy={66} r={9} fill={c.leaf} />
      <Circle cx={130} cy={60} r={10} fill={c.leaf} />
      <Circle cx={136} cy={70} r={8} fill={c.leaf} />
    </G>
  ),

  phone: (c) => (
    <G>
      <Rect x={58} y={16} width={44} height={88} rx={10} fill={c.lavenderDeep} />
      <Rect x={62} y={24} width={36} height={68} rx={5} fill={c.white} />
      <Circle cx={80} cy={50} r={13} fill={c.rose} />
      <Path
        d="M74 44 c0 -1.6 1.4 -2.8 3 -2.4 l1.6 0.5 l-0.6 4 l-1.6 0.8 c1 2.4 2.6 4 5 5 l0.8 -1.6 l4 -0.6 l0.5 1.6 c0.4 1.6 -0.8 3 -2.4 3 c-6 0 -10.3 -4.3 -10.3 -10.3 z"
        fill={c.white}
      />
      <Rect x={68} y={72} width={24} height={5} rx={2.5} fill={c.lavender} />
      <Rect x={72} y={81} width={16} height={5} rx={2.5} fill={c.lavender} />
      <Path d={heart(120, 40, 8)} fill={c.rose} />
      <Path d={sparkle(38, 44, 6)} fill={c.butter} />
    </G>
  ),
};
