import { useEffect, useState } from 'react';

type ListHeaderProps = {
  topic: string;
  title: string;
  hasTimer?: boolean;
};

const endDate = new Date();
endDate.setDate(endDate.getDate() + 3);

export default function ListHeader({
  title,
  topic,
  hasTimer = false,
}: ListHeaderProps) {
  const [currentDate, setCurrentDate] = useState(
    new Date(endDate.getTime() - new Date().getTime())
  );

  const remainingDays = currentDate.getDate();
  const remainingHours = currentDate.getHours();
  const remainingMinutes = currentDate.getMinutes();
  const remainingSeconds = currentDate.getSeconds();

  useEffect(() => {
    if (hasTimer) {
      const id = setInterval(
        () =>
          setCurrentDate(new Date(endDate.getTime() - new Date().getTime())),
        1000
      );

      return () => {
        clearInterval(id);
      };
    }

    return;
  }, [hasTimer]);

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center gap-4'>
        <span className='h-10 w-5 rounded bg-green-700'></span>
        <p className='font-medium text-green-700'>{topic}</p>
      </div>
      <div className='flex gap-20'>
        <h1>{title}</h1>
        {hasTimer && (
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
        )}
      </div>
    </div>
  );
}
