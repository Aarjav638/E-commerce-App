import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store/store';
import {Product} from '../constants/type';

export const filterData = createSelector(
  [
    (state: RootState) => state.product.products,
    (state: RootState, searchQuery: string) => searchQuery,
  ],
  (products, searchQuery) => {
    if (!products) {
      return [];
    }

    const lowerSearchQuery = searchQuery.toLowerCase().trim() || '';

    const filteredData1 = products.filter(
      (item: Product) =>
        item.title.includes(searchQuery) ||
        item.category.toLowerCase().includes(lowerSearchQuery) ||
        item.description.toLowerCase().includes(lowerSearchQuery),
    );
    return filteredData1;
  },
);
