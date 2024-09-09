import {combineReducers, configureStore} from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistCartConfig = {
  key: 'cart',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistCartConfig, cartReducer);
const rootReducer = combineReducers({
  product: productReducer,
  cart: persistedReducer,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(),
});

const persistor = persistStore(store);
export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
