import { toggleFavorite } from './favorites';

describe('toggleFavorite', () => {
  it('adds new favorites to the front', () => {
    expect(toggleFavorite(['a'], 'b')).toEqual(['b', 'a']);
  });
  it('removes an existing favorite', () => {
    expect(toggleFavorite(['b', 'a'], 'b')).toEqual(['a']);
  });
});
