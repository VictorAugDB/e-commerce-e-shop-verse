import Product from '@/components/Product';

const endDate = new Date();
endDate.setDate(endDate.getDate() + 3);

export default function ListProducts() {
  const currentDate = new Date(endDate.getTime() - new Date().getTime());
  const remainingDays = currentDate.getDate();
  const remainingHours = currentDate.getHours();
  const remainingMinutes = currentDate.getMinutes();
  const remainingSeconds = currentDate.getSeconds();

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
              <span className='text-3xl'>{remainingDays}</span>
              <span className='text-3xl'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs'>Hours</span>
            <div className='flex gap-x-4'>
              <span className='text-3xl'>{remainingHours}</span>
              <span className='text-3xl'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs'>Minutes</span>
            <div className='flex gap-x-4'>
              <span className='text-3xl'>{remainingMinutes}</span>
              <span className='text-3xl'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs'>Seconds</span>
            <span className='block text-3xl'>{remainingSeconds}</span>
          </div>
        </div>
      </div>
      <div className='flex flex-1 items-center gap-[1.875rem]'>
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
    </div>
  );
}
