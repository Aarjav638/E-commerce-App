import {Middleware, isAnyOf} from '@reduxjs/toolkit';
import {addToCart, removeFromCart} from '../features/cart/cartSlice';

export const cartLoggingMiddleware: Middleware = store => next => action => {
  if (isAnyOf(addToCart, removeFromCart)(action)) {
    const typedAction = action as ReturnType<
      typeof addToCart | typeof removeFromCart
    >;

    console.log('Dispatching', typedAction);
    console.log('Previous state:', store.getState().cart);

    const result = next(action);

    console.log('Next state:', store.getState().cart);

    return result;
  }

  return next(action);
};
