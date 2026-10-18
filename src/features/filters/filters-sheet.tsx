import { useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  NO_FILTERS,
  sortLabels,
  toggled,
  type AgeRange,
  type ListFilters,
  type SortOrder,
} from '@/domain/filters';
import { AppText, Button, Chip, haptics } from '@/ui';

export type FilterOption = { id: string; label: string };

/** Which parts of the sheet a list offers. Leave a part out to hide it. */
export type FilterSheetConfig = {
  sorts: SortOrder[];
  ages?: AgeRange[];
  /** A pick-any list, e.g. "Food type" or "Topic". */
  categories?: { title: string; options: FilterOption[] };
  allergens?: FilterOption[];
  /** Foods: Tried / Not tried, from the food log. */
  tracked?: boolean;
  /** Checkboxes; every checked one must hold. */
  flags?: FilterOption[];
};

export type FiltersSheetProps = {
  visible: boolean;
  /** The filters in use; the sheet edits a copy until "Apply filters". */
  value: ListFilters;
  config: FilterSheetConfig;
  onApply(filters: ListFilters): void;
  onClose(): void;
};

function SectionTitle({ children }: { children: string }) {
  return (
    <AppText variant="heading" accessibilityRole="header">
      {children}
    </AppText>
  );
}

/** A section that opens with "+" and closes with "−", for long option lists. */
function Expandable({
  title,
  picked,
  children,
}: {
  title: string;
  picked: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(picked > 0);
  return (
    <View className="border-t border-border">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={picked ? `${title}, ${picked} picked` : title}
        onPress={() => setOpen((o) => !o)}
        className="min-h-14 flex-row items-center justify-between active:opacity-70"
      >
        <AppText variant="heading">{picked ? `${title} (${picked})` : title}</AppText>
        <AppText variant="heading" size="2xl" color="muted">
          {open ? '−' : '+'}
        </AppText>
      </Pressable>
      {open ? <View className="flex-row flex-wrap gap-2 pb-4">{children}</View> : null}
    </View>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle(): void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => {
        haptics.select();
        onToggle();
      }}
      className="min-h-14 flex-row items-center justify-between border-t border-border active:opacity-70"
    >
      <AppText variant="heading">{label}</AppText>
      <View
        className={
          checked
            ? 'h-7 w-7 items-center justify-center rounded-lg border-2 border-primary bg-primary'
            : 'h-7 w-7 items-center justify-center rounded-lg border-2 border-border bg-surface'
        }
      >
        {checked ? (
          <AppText color="on-primary" className="font-bold">
            ✓
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Bottom sheet for sorting and filtering a list (Mom recipes, Baby recipes and foods,
 * Insights). Changes apply when "Apply filters" is tapped; swiping down cancels.
 */
export function FiltersSheet({ visible, value, config, onApply, onClose }: FiltersSheetProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);
  // Each time the sheet opens, start from the filters in use.
  const [wasVisible, setWasVisible] = useState(visible);
  if (wasVisible !== visible) {
    setWasVisible(visible);
    if (visible) setDraft(value);
  }
  const set = (patch: Partial<ListFilters>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-canvas" onAccessibilityEscape={onClose}>
        <View className="items-center pt-2" importantForAccessibility="no-hide-descendants">
          <View className="h-1.5 w-10 rounded-full bg-border" />
        </View>
        <View className="flex-row items-center justify-between gap-3 px-5 pb-2 pt-4">
          <AppText variant="title" accessibilityRole="header">
            Filters
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDraft({ ...NO_FILTERS })}
            hitSlop={8}
            className="min-h-12 justify-center active:opacity-70"
          >
            <AppText variant="label" color="primary" className="font-bold underline">
              Reset all filters
            </AppText>
          </Pressable>
        </View>

        <ScrollView contentContainerClassName="gap-6 px-5 pb-8 pt-2">
          <View>
            <SectionTitle>Sort by</SectionTitle>
            <View className="pt-1">
              {config.sorts.map((s) => {
                const selected = draft.sort === s;
                return (
                  <Pressable
                    key={s}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      if (!selected) haptics.select();
                      set({ sort: s });
                    }}
                    className="min-h-12 flex-row items-center justify-between active:opacity-70"
                  >
                    <AppText className={selected ? 'font-bold' : undefined}>{sortLabels[s]}</AppText>
                    {selected ? (
                      <AppText color="primary" size="xl" className="font-bold">
                        ✓
                      </AppText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {config.ages ? (
            <View className="gap-3">
              <SectionTitle>Age</SectionTitle>
              <View className="flex-row flex-wrap gap-2">
                <Chip label="All" selected={!draft.ageId} onPress={() => set({ ageId: null })} />
                {config.ages.map((a) => (
                  <Chip
                    key={a.id}
                    label={a.label}
                    selected={draft.ageId === a.id}
                    onPress={() => set({ ageId: a.id })}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <View>
            {config.categories ? (
              <Expandable title={config.categories.title} picked={draft.categories.length}>
                {config.categories.options.map((o) => (
                  <Chip
                    key={o.id}
                    label={o.label}
                    selected={draft.categories.includes(o.id)}
                    onPress={() => set({ categories: toggled(draft.categories, o.id) })}
                  />
                ))}
              </Expandable>
            ) : null}
            {config.allergens ? (
              <Expandable title="Leave out allergens" picked={draft.excludeAllergens.length}>
                {config.allergens.map((o) => (
                  <Chip
                    key={o.id}
                    label={o.label}
                    selected={draft.excludeAllergens.includes(o.id)}
                    onPress={() => set({ excludeAllergens: toggled(draft.excludeAllergens, o.id) })}
                  />
                ))}
              </Expandable>
            ) : null}
            {config.tracked ? (
              <View className="gap-3 border-t border-border py-4">
                <SectionTitle>My tracked foods</SectionTitle>
                <View className="flex-row flex-wrap gap-2">
                  <Chip
                    label="Tried"
                    selected={draft.tried === 'tried'}
                    onPress={() => set({ tried: draft.tried === 'tried' ? null : 'tried' })}
                  />
                  <Chip
                    label="Not tried"
                    selected={draft.tried === 'not-tried'}
                    onPress={() => set({ tried: draft.tried === 'not-tried' ? null : 'not-tried' })}
                  />
                </View>
              </View>
            ) : null}
            {config.flags?.map((f) => (
              <CheckRow
                key={f.id}
                label={f.label}
                checked={draft.flags.includes(f.id)}
                onToggle={() => set({ flags: toggled(draft.flags, f.id) })}
              />
            ))}
          </View>
        </ScrollView>

        <View
          className="border-t border-border bg-canvas px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Button
            label="Apply filters"
            onPress={() => {
              haptics.tap();
              onApply(draft);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
