import { favoriteFoodIds, foodFavoriteId, toggleFavorite } from './favorites';

describe('toggleFavorite', () => {
  it('adds new favorites to the front', () => {
    expect(toggleFavorite(['a'], 'b')).toEqual(['b', 'a']);
  });
  it('removes an existing favorite', () => {
    expect(toggleFavorite(['b', 'a'], 'b')).toEqual(['a']);
  });
});

describe('food favorites', () => {
  it('keeps foods apart from recipes in the shared list', () => {
    const ids = toggleFavorite(['baby-pear-puree'], foodFavoriteId('kale'));
    expect(ids).toEqual(['food:kale', 'baby-pear-puree']);
    expect(favoriteFoodIds(ids)).toEqual(['kale']);
  });
});
