export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};
export type ProductState = {
  products: Product[];
  loading: boolean;
  error: string;
};

export type Rating = {
  rate: number;
  count: number;
};

export type CartState = {
  cartItems: Product[];
  addedToCart: boolean;
};
