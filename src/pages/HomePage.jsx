import SectionCard from '../components/common/SectionCard'
import ProductCard from '../components/home/ProductCard'
import PopularTicker from '../components/home/PopularTicker'
import CategoryGrid from '../components/home/CategoryGrid'
import { Bell, Search } from 'lucide-react'
import { bannerTexts, categories, currentLocation } from '../data/mockData'
import { useEffect, useState } from 'react'

function HomePage({
  products,
  onReserve,
  onToggleFavorite,
  favoriteItems,
  onOpenNotifications,
  unreadCount,
  onOpenProductDetail,
  onOpenStore,
}) {
  const [bannerIndex, setBannerIndex] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerTexts.length)
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    if (!searchKeyword.trim()) return
    onOpenStore(searchKeyword.trim())
  }

  return (
    <div className="page page-home">
      <div className="home-header-section">
      <div className="home-topbar">
        <div className="location-bar">📍 현재 위치 · {currentLocation}</div>

        <button className="notification-button" onClick={onOpenNotifications}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
      </div>

      <div className="home-search-bar-pill">
  <input
    className="home-search-input-pill"
    placeholder="가게 이름을 검색해보세요"
    value={searchKeyword}
    onChange={(e) => setSearchKeyword(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') handleSearch()
    }}
  />
  <button
    className="home-search-icon-button"
    onClick={handleSearch}
    type="button"
    aria-label="검색"
  >
    <Search size={28} strokeWidth={2.4} />
  </button>
</div>
      </div>

      <SectionCard className="banner-card">
        <div className="banner-content">
          <span className="banner-label">광고 배너</span>
          <h2>{bannerTexts[bannerIndex]}</h2>
          <p>폐기 임박 식품을 더 합리적으로 구매해보세요.</p>
        </div>
      </SectionCard>

      <PopularTicker items={products} />

      <SectionCard>
        <div className="section-title-row">
          <h2>카테고리</h2>
        </div>
        <CategoryGrid categories={categories} />
      </SectionCard>

      <div className="section-title-row section-spacing-top">
        <h2>실시간 인기 상품</h2>
      </div>

      <div className="product-list">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            rank={index + 1}
            onReserve={onReserve}
            onToggleFavorite={onToggleFavorite}
            onOpenDetail={onOpenProductDetail}
            onOpenStore={onOpenStore}
            isFavorite={favoriteItems.some(
              (item) => item.name === product.name && item.storeId === product.storeId,
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage