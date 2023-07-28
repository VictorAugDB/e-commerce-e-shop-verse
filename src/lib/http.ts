import { Coupon, Product } from '@/pages/cart';

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch('http://localhost:3002/products');
  return await res.json();
};

export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await fetch('http://localhost:3002/coupons');
  return await res.json();
};
