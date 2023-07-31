import {
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';

import { getProducts } from '@/lib/http';

import { Product } from '@/contexts/ProductsContext';

type ProductsProps = {
  products: Product[];
};

export default function Products({
  products,
}: InferGetStaticPropsType<GetStaticProps<ProductsProps>>) {
  return <div>{products.map((p) => p.id)}</div>;
}

export const getStaticProps: GetStaticProps<ProductsProps> = async (): Promise<
  GetStaticPropsResult<ProductsProps>
> => {
  const products = await getProducts();

  return {
    props: { products },
  };
};
