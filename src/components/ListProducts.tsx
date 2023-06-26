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
        <p>Today's</p>
      </div>
      <div className='flex gap-20'>
        <h1>Flash Sales</h1>
        <div className='flex items-center gap-4'>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Days</span>
            <div className='flex gap-x-4'>
              <span className='text-[2rem] leading-[1.875rem]'>
                {remainingDays}
              </span>
              <span className='text-[2rem] leading-[1.875rem]'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Hours</span>
            <div className='flex gap-x-4'>
              <span className='text-[2rem] leading-[1.875rem]'>
                {remainingHours}
              </span>
              <span className='text-[2rem] leading-[1.875rem]'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Minutes</span>
            <div className='flex gap-x-4'>
              <span className='text-[2rem] leading-[1.875rem]'>
                {remainingMinutes}
              </span>
              <span className='text-[2rem] leading-[1.875rem]'>:</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-[1.125rem]'>Seconds</span>
            <span className='block text-[2rem] leading-[1.875rem]'>
              {remainingSeconds}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
