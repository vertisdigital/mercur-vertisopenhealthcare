import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { listCategories } from "@/lib/data/categories"

export const HomeCategories = async ({ heading }: { heading: string }) => {
  const { parentCategories } = await listCategories({
    query: { include_ancestors_tree: false },
  }).catch(() => ({ parentCategories: [] }))

  if (!parentCategories || parentCategories.length === 0) {
    return null
  }

  return (
    <section className="bg-primary py-4 w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={parentCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={{
              name: category.name || "",
              handle: category.handle || "",
            }}
          />
        ))}
      />
    </section>
  )
}

