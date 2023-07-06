import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import * as React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function Layout({
  children,
  font,
}: {
  children: React.ReactNode;
  font: NextFontWithVariable;
}) {
  // Put Header or Footer Here
  return (
    <main className={`${font.variable} w-full font-sans`}>
      <Header />
      <div>{children}</div>
      <Footer />
    </main>
  );
}
