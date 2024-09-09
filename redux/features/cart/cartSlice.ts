import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartState, Product} from '../../constants/type';

const initialCartState = {
  cartItems: [],
  addedToCart: false,
} as CartState;

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state: CartState, action: PayloadAction<Product>) => {
      state.cartItems = [...state.cartItems, action.payload];
      state.addedToCart = true;
    },
    removeFromCart: (state: CartState, action: PayloadAction<{id: number}>) => {
      const index = state.cartItems.findIndex(
        item => item.id === action.payload.id,
      );

      if (index !== -1) {
        state.cartItems.splice(index, 1);
      }
    },
  },
});

export const {addToCart, removeFromCart} = cartSlice.actions;
export default cartSlice.reducer;
