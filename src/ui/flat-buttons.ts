import { createContext, useContext } from 'react';

/**
 * Round floating buttons (back, heart) drop their shadow inside this, e.g. when they
 * sit on a solid top bar instead of floating over a photo.
 */
export const FlatButtonsContext = createContext(false);

export function useFlatButtons(): boolean {
  return useContext(FlatButtonsContext);
}
