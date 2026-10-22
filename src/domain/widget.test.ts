import {
  NOT_PLANNED,
  OPEN_APP,
  storedWidgetDays,
  todayWidgetEntries,
  widgetPropsFor,
} from './widget';

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

describe('Android widget days', () => {
  const plan = { '2026-10-15|lunch': 'food:avocado' };
  const title = (id: string) => (id === 'food:avocado' ? 'Avocado' : null);

  it('saves a week of days and shows the one for today', () => {
    const days = storedWidgetDays(plan, '2026-10-14', 'Mila', title);
    expect(days.map((d) => d.date)).toEqual([
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
      '2026-10-17',
      '2026-10-18',
      '2026-10-19',
      '2026-10-20',
    ]);
    const saved = JSON.stringify(days);
    expect(widgetPropsFor(saved, '2026-10-15')).toEqual({
      heading: 'Today for Mila',
      breakfast: NOT_PLANNED,
      lunch: 'Avocado',
      dinner: NOT_PLANNED,
    });
  });

  it('asks to open the app when nothing is saved for the day', () => {
    const saved = JSON.stringify(storedWidgetDays(plan, '2026-10-14', null, title));
    expect(widgetPropsFor(saved, '2026-11-30').breakfast).toBe(OPEN_APP);
    expect(widgetPropsFor(null, '2026-10-14').lunch).toBe(OPEN_APP);
    expect(widgetPropsFor('not json', '2026-10-14').dinner).toBe(OPEN_APP);
  });
});
