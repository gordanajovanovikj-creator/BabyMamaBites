/**
 * Flat illustration colors (SVG fills can't take classNames), in the app's soft
 * earthy palette: sage, warm cream, oat, terracotta and butter yellow. Key names
 * are roles kept from the first palette: "rose" is now terracotta, "lavender"
 * soft sage, "sky" a pale sage-blue. Light-only, like the app.
 */
export const illustrationPalette = {
  light: {
    blob: '#FFFFFF',
    blobOpacity: 0.75,
    blobOnWhite: '#F6F2EA',
    blobOnDarkOpacity: 0.18,
    white: '#FFFFFF',
    cream: '#FBF3E2',
    rose: '#D9805E',
    roseSoft: '#EDB9A0',
    roseDeep: '#B25A3B',
    lavender: '#C9D9BD',
    lavenderDeep: '#7E9C72',
    sky: '#D3E0D8',
    skyDeep: '#7A9A8C',
    butter: '#F3D98B',
    honey: '#E2B04A',
    mint: '#CFE3C4',
    leaf: '#6E9A5E',
    carrot: '#E8945E',
    brown: '#A9825F',
  },
} as const;

export type IllustrationPalette = {
  [K in keyof (typeof illustrationPalette)['light']]: K extends 'blobOpacity' | 'blobOnDarkOpacity'
    ? number
    : string;
};
