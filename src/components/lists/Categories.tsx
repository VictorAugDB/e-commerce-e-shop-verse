import Link from 'next/link'

import { DynamicIcon } from '@/components/DynamicIcon'
import ListHeader from '@/components/lists/ListHeader'

import { CategoriesWithIcons } from '@/pages'

type CategoriesProps = {
  categories: CategoriesWithIcons[]
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <div className="w-full">
      <ListHeader title="Browse By Category" topic="Categories" />
      <div className="mt-[3.75rem] grid grid-cols-6 gap-[1.875rem]">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={{
              pathname: '/products',
              query: { category: category.name.toLowerCase() },
            }}
            className="group h-full w-full transition hover:scale-105 hover:shadow-md"
          >
            <div className="flex flex-col items-center justify-center gap-4 rounded border border-solid border-black/30 px-14 py-6">
              <DynamicIcon width={56} height={56} icon={category.icon} />
              <p className="group-hover:font-semibold">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
