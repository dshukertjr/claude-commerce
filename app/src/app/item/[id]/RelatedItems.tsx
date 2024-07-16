import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { FashionItem } from '../../types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getRelatedItems(currentId: number, embedding: string) {
  const { data, error } = await supabase.rpc('find_similar_fashion_items', {
    input_id: currentId,
    input_embedding: embedding,
  })

  if (error) {
    console.error('Error fetching related items:', error)
    return []
  }

  return data ?? []
}

export default async function RelatedItems({
  currentId,
  currentEmbedding,
}: {
  currentId: number
  currentEmbedding: string
}) {
  const relatedItems = await getRelatedItems(currentId, currentEmbedding)

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Related Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {relatedItems.map((item: any) => (
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
    </div>
  )
}
