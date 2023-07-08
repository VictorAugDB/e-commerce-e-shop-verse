/* eslint-disable @next/next/no-img-element */
import ShopNowButton from '@/components/ShopNowButton';

type BackgroundProductProps = {
  imagePath: string;
  name: string;
  description: string;
  href: string;
};

export default function BackgroundProduct({
  imagePath,
  name,
  description,
  href,
}: BackgroundProductProps) {
  return (
    <div className='relative flex flex-1 flex-col justify-end gap-4 bg-black'>
      <div className='z-10 flex flex-col gap-4'>
        <h3>{name}</h3>
        <p className='text-sm'>{description}</p>
        <ShopNowButton href={href} />
      </div>
      <div
        style={{ '--image-url': `url(${imagePath})` } as React.CSSProperties}
        className='absolute bottom-0 bg-[image:var(--image-url)] bg-no-repeat'
      >
        <img src={imagePath} alt='' className='' />
      </div>
    </div>
  );
}
