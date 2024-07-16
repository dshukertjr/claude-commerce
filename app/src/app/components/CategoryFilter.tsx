'use client'
import { useRouter } from 'next/navigation'

export default function CategoryFilter({
  categories,
  selectedCategory,
}: {
  categories: string[]
  selectedCategory?: string
}) {
  const router = useRouter()

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      router.push(`/?category=${category}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            !selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleCategoryChange(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
