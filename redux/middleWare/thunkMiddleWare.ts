import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchProductsAsync = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    return response.json();
  },
);
