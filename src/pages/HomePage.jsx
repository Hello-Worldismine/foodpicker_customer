import SectionCard from '../components/common/SectionCard'
import ProductCard from '../components/home/ProductCard'
import PopularTicker from '../components/home/PopularTicker'
import CategoryGrid from '../components/home/CategoryGrid'
import { bannerTexts, categories, currentLocation } from '../data/mockData'
import { useEffect, useState } from 'react'

function HomePage({ products, onReserve }) {
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerTexts.length)
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="page page-home">
      <div className="location-bar">📍 현재 위치 · {currentLocation}</div>

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
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage