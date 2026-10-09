/**
 * Flat illustration colors (SVG fills can't take classNames). Soft, warm and on-brand:
 * blush and rose with lavender, sky and a few food colors. Dark mode is dimmed slightly
 * so white plates and jars don't glare.
 */
export const illustrationPalette = {
  light: {
    blob: '#FFFFFF',
    blobOpacity: 0.7,
    blobOnWhite: '#FDEEF1',
    blobOnDarkOpacity: 0.16,
    white: '#FFFFFF',
    cream: '#FFF4E0',
    rose: '#DB6487',
    roseSoft: '#F5A3BC',
    roseDeep: '#B84A6E',
    lavender: '#CDBEF2',
    lavenderDeep: '#8E78D0',
    sky: '#BFD6F2',
    skyDeep: '#6F95C9',
    butter: '#F8D57E',
    honey: '#E9A93B',
    mint: '#BFE3CF',
    leaf: '#6FB58C',
    carrot: '#F29B5C',
    brown: '#B98463',
  },
  dark: {
    blob: '#FFFFFF',
    blobOpacity: 0.1,
    blobOnWhite: '#2E2433',
    blobOnDarkOpacity: 0.1,
    white: '#EFE4EA',
    cream: '#F1E2C8',
    rose: '#E0779A',
    roseSoft: '#F5A3BC',
    roseDeep: '#C25A7D',
    lavender: '#B8A8E6',
    lavenderDeep: '#8E78D0',
    sky: '#A9C3E6',
    skyDeep: '#6F95C9',
    butter: '#EBC46C',
    honey: '#D99A32',
    mint: '#A8D6BE',
    leaf: '#62A67E',
    carrot: '#E58D50',
    brown: '#A87657',
  },
} as const;

export type IllustrationPalette = {
  [K in keyof (typeof illustrationPalette)['light']]: K extends 'blobOpacity' | 'blobOnDarkOpacity'
    ? number
    : string;
};
