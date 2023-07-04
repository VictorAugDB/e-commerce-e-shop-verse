import Button from '@/components/buttons/Button';
import ListHeader from '@/components/lists/ListHeader';
import Product from '@/components/Product';

type ListProductsProps = {
  topic: string;
  title: string;
  hasTimer?: boolean;
};

export default function ListProducts({
  title,
  topic,
  hasTimer,
}: ListProductsProps) {
  return (
    <div className='flex w-full flex-col gap-10'>
      <ListHeader topic={topic} title={title} hasTimer={hasTimer}></ListHeader>
      <div className='grid grid-cols-4 items-center gap-[1.875rem]'>
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
      </div>
      <Button className='mx-auto w-fit px-12 py-4' variant='green'>
        View All Products
      </Button>
    </div>
  );
}
