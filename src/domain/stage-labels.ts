import type { Stage } from './stage';

export const stageLabels: Record<Stage, { title: string; focus: string }> = {
  newborn: {
    title: 'The newborn months',
    focus: 'This stage is about you: simple, nourishing food and as much rest as you can find.',
  },
  solids: {
    title: 'Starting solids',
    focus: 'New tastes and textures for baby, with family meals that work for everyone.',
  },
  toddler: {
    title: 'Toddler days',
    focus: 'Family food your toddler can share, and gentle ideas for picky phases.',
  },
};
