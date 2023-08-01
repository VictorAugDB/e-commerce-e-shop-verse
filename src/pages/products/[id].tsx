import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';
import { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { getProductById, getProducts } from '@/lib/http';

import NextImage from '@/components/NextImage';
import Steps from '@/components/Steps';

import { Product } from '@/contexts/ProductsContext';

type ProductProps = {
  product: Product;
};

export default function Product({
  product,
}: InferGetStaticPropsType<GetStaticProps<ProductProps>>) {
  const [images, setImages] = useState([
    product.image,
    '/images/keyboard.png',
    '/images/jbl-radio.png',
  ]);
  const changeIdx = useRef<string | null>(null);

  function handleChangeImage(idx: number) {
    const img = images[idx];
    const imgs = images.filter((i) => i !== img);

    setImages([...imgs]);
    changeIdx.current = img;
  }

  return (
    <div className='px-[8.4375rem]'>
      <Steps
        flow='product'
        currentStep={2}
        category='Gaming'
        productName={product.name}
      />

      <div
        className='grid max-h-[37.5rem] w-full max-w-[43.875rem] grid-cols-[10.625rem_31.25rem] grid-rows-4 gap-8'
        style={{
          gridTemplateAreas: `
          'small large'
          'small large'
          'small large'
          'small large'
        `,
        }}
      >
        <div
          className='relative flex h-full w-[31.25rem] items-center justify-center bg-gray-200 p-4'
          style={{
            gridArea: 'large',
          }}
        >
          <SwitchTransition>
            <CSSTransition
              key={images[images.length - 1]}
              timeout={200}
              classNames='my-node'
            >
              <NextImage
                alt='product-image'
                src={images[images.length - 1]}
                width={446}
                height={315}
              ></NextImage>
            </CSSTransition>
          </SwitchTransition>
        </div>
        {images.slice(0, images.length - 1).map((i, idx) => (
          <div
            onClick={() => handleChangeImage(idx)}
            key={i}
            data-idx={idx}
            className='relative flex h-full w-[10.625rem] max-w-full items-center justify-center rounded bg-gray-200 p-4'
          >
            <NextImage
              alt='product-image'
              src={i}
              width={134}
              height={114}
            ></NextImage>
          </div>
        ))}
      </div>
    </div>
  );
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
