import { useState } from 'react';
import { View } from 'react-native';

import { activeFilterCount, type ListFilters } from '@/domain/filters';
import { FilterButton, SearchField } from '@/ui';

import { FiltersSheet, type FilterSheetConfig } from './filters-sheet';

export type SearchFilterBarProps = {
  query: string;
  onQueryChange(query: string): void;
  placeholder: string;
  /** Read by VoiceOver, e.g. "Search recipes". */
  label: string;
  filters: ListFilters;
  onFiltersChange(filters: ListFilters): void;
  config: FilterSheetConfig;
};

/** An always-open search box with a filter button on its right that opens the Filters sheet. */
export function SearchFilterBar({
  query,
  onQueryChange,
  placeholder,
  label,
  filters,
  onFiltersChange,
  config,
}: SearchFilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <View className="flex-row items-center gap-3 px-5">
      <View className="flex-1">
        <SearchField
          label={label}
          placeholder={placeholder}
          value={query}
          onChangeText={onQueryChange}
        />
      </View>
      <FilterButton count={activeFilterCount(filters)} onPress={() => setSheetOpen(true)} />
      <FiltersSheet
        visible={sheetOpen}
        value={filters}
        config={config}
        onClose={() => setSheetOpen(false)}
        onApply={(next) => {
          onFiltersChange(next);
          setSheetOpen(false);
        }}
      />
    </View>
  );
}
