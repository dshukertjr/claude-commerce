import { createClient } from '@supabase/supabase-js'
import ItemList from './components/ItemList'
import CategoryFilter from './components/CategoryFilter'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getCategories() {
  const { data, error } = await supabase
    .from('distinct_categories_view')
    .select()

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data?.map((item) => item.category) || []
}

async function getItems(category: string | null) {
  let query = supabase.from('fashion_items').select('*')
  if (category) {
    query = query.eq('category', category)
  }
  const { data, error } = await query

  if (error) {
    console.error('Error fetching items:', error)
    return []
  }

  return data || []
}

export default async function Home({
  searchParams,
}: {
  searchParams: { category: string | undefined }
}) {
  const categories = await getCategories()
  const items = await getItems(searchParams.category || null)

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Fashion Brand</h1>
      <CategoryFilter
        categories={categories}
        selectedCategory={searchParams.category}
      />
      <ItemList items={items} />
    </div>
  )
}
