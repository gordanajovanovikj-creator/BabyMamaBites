import { photoSources, type PhotoCredit, type PhotoSource } from '@/content/photo-credits';

export const photoSourceInfo: Record<PhotoSource, { name: string; url: string; note: string }> = {
  magnific: {
    name: 'Magnific',
    url: 'https://www.magnific.com',
    note: 'Designed by Magnific',
  },
  dreamstime: {
    name: 'Dreamstime',
    url: 'https://www.dreamstime.com',
    note: 'Licensed from Dreamstime.com',
  },
  pixabay: {
    name: 'Pixabay',
    url: 'https://pixabay.com',
    note: 'Free under the Pixabay Content License',
  },
};

/** "© Author | Dreamstime.com", "Author on Pixabay", "Designed by Magnific". */
export function creditLine(credit: PhotoCredit): string {
  switch (credit.source) {
    case 'dreamstime':
      return credit.author ? `© ${credit.author} | Dreamstime.com` : 'Dreamstime.com';
    case 'pixabay':
      return credit.author ? `${credit.author} on Pixabay` : 'Pixabay';
    case 'magnific':
      return credit.author ? `${credit.author}, designed by Magnific` : 'Designed by Magnific';
  }
}

/** Credits grouped by source in a fixed order, each group sorted by title; empty groups dropped. */
export function creditsBySource(
  credits: PhotoCredit[],
): { source: PhotoSource; credits: PhotoCredit[] }[] {
  return photoSources
    .map((source) => ({
      source,
      credits: credits
        .filter((c) => c.source === source)
        .sort((a, b) => a.usedOn.localeCompare(b.usedOn)),
    }))
    .filter((g) => g.credits.length > 0);
}
