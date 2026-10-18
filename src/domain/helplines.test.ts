import { helplinesIn } from './helplines';

describe('helplinesIn', () => {
  it('finds the numbers a text mentions, 911 first', () => {
    expect(helplinesIn('Call or text 988. If you are in danger, call 911.')).toEqual([
      '911',
      '988',
    ]);
    expect(helplinesIn('Hotline: 1-833-TLC-MAMA (1-833-852-6262)')).toEqual(['tlc-mama']);
  });

  it('finds Postpartum Support International and Poison Control', () => {
    expect(helplinesIn('PSI at 1-800-944-4773 or Poison Control at 1-800-222-1222')).toEqual([
      'psi',
      'poison',
    ]);
  });

  it('ignores numbers inside other numbers', () => {
    expect(helplinesIn('About 9110 steps and 19880 calories')).toEqual([]);
  });
});
