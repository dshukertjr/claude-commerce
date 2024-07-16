import Link from 'next/link'
import { FashionItem } from '../types'

export default function ItemList({ items }: { items: FashionItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <Link href={`/item/${item.id}`} key={item.id}>
          <div className="border rounded-lg overflow-hidden shadow-lg">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.category}</p>
              <p className="text-blue-600 font-bold mt-2">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
