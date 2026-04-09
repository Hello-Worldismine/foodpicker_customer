import {
  BadgePercent,
  Carrot,
  Clock3,
  Cookie,
  Fish,
  Package,
  Salad,
  ShoppingCart,
  Store,
  Utensils,
} from 'lucide-react'

const iconMap = {
  cookie: Cookie,
  salad: Salad,
  shoppingCart: ShoppingCart,
  store: Store,
  carrot: Carrot,
  fish: Fish,
  utensils: Utensils,
  package: Package,
  badgePercent: BadgePercent,
  clock3: Clock3,
}

function CategoryGrid({ categories }) {
  return (
    <div className="category-grid">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Package

        return (
          <button key={category.id} className="category-item" type="button">
            <span className="category-icon-wrap">
              <Icon className="category-icon-svg" strokeWidth={2} />
            </span>
            <span className="category-name">{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryGrid