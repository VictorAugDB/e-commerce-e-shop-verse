import { useEffect, useState } from 'react';

import Product from '@/components/Product';

const endDate = new Date();
endDate.setDate(endDate.getDate() + 3);

export default function ListProducts() {
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
    <div className='flex flex-col gap-10'>
      <div className='flex items-center'>
        <span></span>
        <p className='font-medium text-green-700'>Today's</p>
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
      <div className='flex flex-1 items-center gap-[1.875rem]'>
        <Product
          imagePath='/images/control.png'
          price={160}
          discount={40}
          numberOfStars={5}
        />
        <Product
          imagePath='/images/keyboard.png'
          price={1160}
          discount={35}
          hasButton={true}
          numberOfStars={4}
        />
        <Product
          imagePath='/images/monitor.png'
          price={400}
          discount={30}
          numberOfStars={4.1}
        />
        <Product
          imagePath='/images/chair.png'
          price={400}
          discount={25}
          numberOfStars={4.9}
        />
      </div>
    </div>
  );
}
