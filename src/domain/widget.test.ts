import { NOT_PLANNED, todayWidgetEntries } from './widget';

describe('todayWidgetEntries', () => {
  const plan = {
    '2026-10-14|breakfast': 'baby-oat-cereal',
    '2026-10-15|dinner': 'food:avocado',
  };
  const titles: Record<string, string> = {
    'baby-oat-cereal': 'Oat cereal',
    'food:avocado': 'Avocado',
  };

  it('gives one entry per day with each meal or a gentle placeholder', () => {
    const entries = todayWidgetEntries(plan, '2026-10-14', 'Mila', (id) => titles[id] ?? null);
    expect(entries).toHaveLength(3);
    expect(entries[0].props).toEqual({
      heading: 'Today for Mila',
      breakfast: 'Oat cereal',
      lunch: NOT_PLANNED,
      dinner: NOT_PLANNED,
    });
    expect(entries[1].props.dinner).toBe('Avocado');
    expect(entries[1].date.getHours()).toBe(0);
  });

  it('falls back to "Today" and skips meals it cannot name', () => {
    const [first] = todayWidgetEntries(plan, '2026-10-14', null, () => null, 1);
    expect(first.props.heading).toBe('Today');
    expect(first.props.breakfast).toBe(NOT_PLANNED);
  });
});
