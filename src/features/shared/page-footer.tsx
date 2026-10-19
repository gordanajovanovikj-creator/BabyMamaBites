import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { GuideSource } from '@/content/monthly-guides';
import type { SafetyNoticeId } from '@/domain/safety-notices';
import { cn } from '@/ui';

import { HealthDisclaimerNote } from './health-disclaimer-note';
import { SafetyNotices } from './safety-notice';
import { SourceLinks } from './source-links';

export type PageFooterProps = {
  /** Every source the page draws on; repeats are shown once. */
  sources?: GuideSource[];
  /** Fine-print safety notices shown above the disclaimer. */
  notices?: SafetyNoticeId[];
  /** Extra fine print (e.g. a page-specific disclaimer), shown after the notices. */
  children?: ReactNode;
  className?: string;
};

/**
 * Closes every health page: sources, safety notices and the disclaimer, set apart from
 * the content above by extra space and a hairline rule.
 */
export function PageFooter({ sources = [], notices = [], children, className }: PageFooterProps) {
  const unique = sources.filter((s, i) => sources.findIndex((o) => o.id === s.id) === i);
  return (
    <View className={cn('mt-8 gap-4 border-t border-border pt-6', className)}>
      <SourceLinks sources={unique} />
      <SafetyNotices ids={notices} />
      {children}
      {/* A page with its own notice keeps only the link, so it never shows two disclaimers. */}
      <HealthDisclaimerNote short={notices.length > 0} />
    </View>
  );
}
