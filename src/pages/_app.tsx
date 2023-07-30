import { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';

import '@/styles/globals.css';

import Layout from '@/components/layout/Layout';

import { CouponProvider } from '@/contexts/CouponContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout font={poppins}>
      <CouponProvider>
        <Component {...pageProps} />
      </CouponProvider>
    </Layout>
  );
}

export default MyApp;
