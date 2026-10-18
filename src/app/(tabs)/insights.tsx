import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { insightCategories } from '@/content/insight-categories';
import { applyFilters, filtersChangeList, libraryFacts, NO_FILTERS } from '@/domain/filters';
import { librarySections } from '@/domain/library';
import { searchLibrary } from '@/domain/search';
import { ALL_SORTS, libraryAges } from '@/features/filters/filter-options';
import { NoMatches } from '@/features/filters/no-matches';
import { SearchFilterBar } from '@/features/filters/search-filter-bar';
import { LibraryCarousel } from '@/features/library/library-carousel';
import { LibraryTile } from '@/features/library/library-tile';
import { useLibrary } from '@/features/library/use-library';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { AppText, Screen } from '@/ui';

const GAP = 12;
const SIDE = 20;

/** Insights library for mom and baby: search and filters, then story-card rows. */
export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { items, ageMonths, babyName } = useLibrary();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(NO_FILTERS);
  const searching = query.trim().length > 0;
  const filtering = searching || filtersChangeList(filters);
  const shown = filtering
    ? applyFilters(
        searching
          ? searchLibrary(
              items,
              query,
              (id) => insightCategories.find((c) => c.id === id)?.label ?? '',
            )
          : items,
        filters,
        libraryFacts(items),
        libraryAges,
      )
    : [];

  const sections = librarySections(insightCategories, items, ageMonths);
  const cell = Math.floor((Math.min(width, 640) - SIDE * 2 - GAP) / 2);
  const name = babyName ?? 'your baby';

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-6"
      stickyHeader={
        <View className="gap-1 px-5" style={{ paddingTop: insets.top + 16 }}>
          <AppText variant="display">Insights</AppText>
          <AppText variant="caption">Articles and tips for you and {name}, chosen by age.</AppText>
        </View>
      }
    >
      <SearchFilterBar
        label="Search articles and tips"
        placeholder="Search articles"
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        config={{
          sorts: ALL_SORTS,
          ages: libraryAges,
          categories: {
            title: 'Topic',
            options: sections.map((s) => ({
              id: s.category.id,
              label: `${s.category.emoji} ${s.category.label}`,
            })),
          },
        }}
      />

      {filtering ? (
        shown.length ? (
          <View className="gap-4 px-5">
            <AppText variant="heading" size="2xl">
              {`${shown.length} ${shown.length === 1 ? 'result' : 'results'} found`}
            </AppText>
            <View className="flex-row flex-wrap" style={{ gap: GAP }}>
              {shown.map((item) => (
                <LibraryTile
                  key={`${item.source}-${item.id}`}
                  item={item}
                  ageMonths={ageMonths}
                  width={cell}
                />
              ))}
            </View>
          </View>
        ) : (
          <NoMatches
            query={query}
            onReset={() => {
              setQuery('');
              setFilters(NO_FILTERS);
            }}
          />
        )
      ) : (
        <>
          {sections.map((s) => (
            <LibraryCarousel
              key={s.category.id}
              title={s.category.label}
              subtitle={s.category.audience === 'mom' ? 'For you' : `For ${name}`}
              items={s.items}
              ageMonths={ageMonths}
              onSeeAll={() => setFilters({ ...NO_FILTERS, categories: [s.category.id] })}
            />
          ))}
        </>
      )}

      <View className="px-5">
        <HealthDisclaimerNote draftReviewer="health professional" />
      </View>
    </Screen>
  );
}
