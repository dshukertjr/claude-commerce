import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { FashionItem } from '../../types'
import RelatedItems from './RelatedItems'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getItem(id: string) {
  const { data, error } = await supabase
    .from('fashion_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    return null
  }

  return data
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)

  if (!item) return <div>Item not found</div>

  return (
    <div className="container mx-auto px-4">
      <Link href="/">
        <button className="mb-8 text-blue-500">← Back to Home</button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
          <p className="text-gray-600 mb-4">{item.category}</p>
          <p className="text-xl font-bold text-blue-600 mb-4">
            ${item.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-8">{item.description}</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
            Add to Cart
          </button>
        </div>
      </div>
      <RelatedItems currentEmbedding={item.embedding} currentId={item.id} />
    </div>
  )
}
