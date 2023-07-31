import { Coupon, Product } from '@/contexts/ProductsContext';

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch('http://localhost:3002/products');
  return await res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`http://localhost:3002/products/${id}`, {
    next: { revalidate: 60 * 60 * 12 },
  }); // 12 hours
  return res.json();
};

export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await fetch('http://localhost:3002/coupons');
  return await res.json();
};
