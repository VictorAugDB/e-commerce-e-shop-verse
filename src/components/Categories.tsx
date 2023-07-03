import { DynamicIcon } from '@/components/DynamicIcon';

import { CategoriesWithIcons } from '@/pages';

type CategoriesProps = {
  categories: CategoriesWithIcons[];
};

export default function Categories({ categories }: CategoriesProps) {
  return (
    <div className='grid grid-cols-6 gap-[1.875rem]'>
      {categories.map((category) => (
        <div
          key={category.name}
          className='flex flex-1 flex-col items-center justify-center gap-4 rounded border border-solid border-[rgba(0,0,0,0.3)] px-14 py-6'
        >
          <DynamicIcon width={56} height={56} icon={category.icon} />
          <p>{category.name}</p>
        </div>
      ))}
    </div>
  );
}
