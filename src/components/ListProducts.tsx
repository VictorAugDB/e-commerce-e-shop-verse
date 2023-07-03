import { useEffect, useState } from 'react';

import Product from '@/components/Product';

type ListProductsProps = {
  title: string;
};

const endDate = new Date();
endDate.setDate(endDate.getDate() + 3);

export default function ListProducts({ title }: ListProductsProps) {
  const [currentDate, setCurrentDate] = useState(
    new Date(endDate.getTime() - new Date().getTime())
  );

  const remainingDays = currentDate.getDate();
  const remainingHours = currentDate.getHours();
  const remainingMinutes = currentDate.getMinutes();
  const remainingSeconds = currentDate.getSeconds();

  useEffect(() => {
    const id = setInterval(
      () => setCurrentDate(new Date(endDate.getTime() - new Date().getTime())),
      1000
    );

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className='flex w-full flex-col gap-10'>
      <div className='flex items-center gap-4'>
        <span className='h-10 w-5 rounded bg-green-700'></span>
        <p className='font-medium text-green-700'>{title}</p>
      </div>
      <div className='flex gap-20'>
        <h1>Flash Sales</h1>
        <div className='flex items-center gap-4'>
          <div>
            <span className='block text-xs'>Days</span>
            <div className='flex gap-x-4'>
              <span className='text-3xl'>
                {remainingDays >= 10 ? remainingDays : `0${remainingDays}`}
              </span>
              <span className='text-3xl'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs'>Hours</span>
            <div className='flex gap-x-4'>
              <span className='text-3xl'>
                {remainingHours >= 10 ? remainingHours : `0${remainingHours}`}
              </span>
              <span className='text-3xl'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs'>Minutes</span>
            <div className='flex gap-x-4'>
              <span className='text-3xl'>
                {remainingMinutes >= 10
                  ? remainingMinutes
                  : `0${remainingMinutes}`}
              </span>
              <span className='text-3xl'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs'>Seconds</span>
            <span className='block text-3xl'>
              {remainingSeconds >= 10
                ? remainingSeconds
                : `0${remainingSeconds}`}
            </span>
          </div>
        </div>
      </div>
      <div className='mr-[-10.625rem] flex max-w-[calc(100vw-9.825rem)] flex-1 items-center gap-[1.875rem] overflow-auto'>
        <Product
          imagePath='/images/control.png'
          price={160}
          discount={40}
          numberOfStars={5}
          numberOfEvalitions={88}
          name='HAVIT HV-G92 Gamepad'
        />
        <Product
          imagePath='/images/keyboard.png'
          price={1160}
          discount={35}
          hasButton={true}
          numberOfStars={4}
          numberOfEvalitions={89}
          name='AK-900 Wired Keyboard'
        />
        <Product
          imagePath='/images/monitor.png'
          price={400}
          discount={30}
          numberOfStars={4.1}
          numberOfEvalitions={88}
          name='IPS LCD Gaming Monitor'
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
          numberOfEvalitions={100}
          name='S-Series Comfort Chair '
        />
      </div>
    </div>
  );
}
