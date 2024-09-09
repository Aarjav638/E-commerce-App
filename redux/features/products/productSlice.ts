import {createSlice} from '@reduxjs/toolkit';
import {fetchProductsAsync} from '../../middleWare/thunkMiddleWare';
import {ProductState} from '../../constants/type';
const initialProductState = {
  products: [],
  loading: false,
  error: '',
} as ProductState;

const productSlice = createSlice({
  name: 'product',
  initialState: initialProductState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProductsAsync.pending, state => {
        state.loading = true;
        state.error = '';
        state.products = [];
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = '';
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.error.message || ' Something went wrong';
      });
  },
});

export default productSlice.reducer;
