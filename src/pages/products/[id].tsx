import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';

import { getProductById, getProducts } from '@/lib/http';

import { Product } from '@/contexts/ProductsContext';

type ProductProps = {
  product: Product;
};

export default function Product({
  product,
}: InferGetStaticPropsType<GetStaticProps<ProductProps>>) {
  return <div>{product.id}</div>;
}
export async function getStaticPaths() {
  const products = await getProducts();
  const paths = products.map((p) => ({
    params: { id: p.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ id: string }>): Promise<
  GetStaticPropsResult<ProductProps>
> {
  if (!params) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const product = await getProductById(params.id);

  return {
    props: { product },
  };
}
