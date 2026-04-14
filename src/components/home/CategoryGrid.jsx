import {
  Cookie,
  Salad,
  ShoppingCart,
  Store,
  Carrot,
  Fish,
  Utensils,
  Package,
  BadgePercent,
  Clock3,
} from 'lucide-react'

const iconMap = {
  cookie: Cookie,             // 빵/디저트
  salad: Salad,               // 반찬가게
  shoppingCart: ShoppingCart, // 마트
  store: Store,               // 전통시장
  carrot: Carrot,             // 야채가게
  fish: Fish,                 // 육류/어류
  utensils: Utensils,         // 식당
  package: Package,           // 편의점
  badgePercent: BadgePercent, // 70% 할인
  clock3: Clock3,             // 초긴급
}

function CategoryGrid({ categories }) {
  return (
    <div className="category-grid category-grid-4col">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Store

        return (
          <button key={category.id} className="category-icon-card" type="button">
            <span className="category-icon-box">
              <Icon className="category-icon-svg" strokeWidth={2} />
            </span>
            <span className="category-icon-label">{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryGrid