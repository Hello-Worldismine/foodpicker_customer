import { Heart } from 'lucide-react'
import TrendChart from '../common/TrendChart'

function ProductCard({
  product,
  rank,
  onReserve,
  onToggleFavorite,
  onOpenDetail,
  onOpenStore,
  isFavorite,
  compactRank = false,
}) {
  return (
    <div className="product-card">
      <div className="product-card-topline">
        <div className={`rank-badge ${compactRank ? 'compact' : ''}`}>{rank}순위</div>

        <button
          className={`favorite-icon-button ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(product)}
          aria-label="찜하기"
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          <span className="favorite-count">{product.favoriteCount ?? 0}</span>
        </button>
      </div>

      <div className="product-top-row">
        <img className="product-image" src={product.image} alt={product.name} />
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>

          <button
            className="store-link-button"
            onClick={() => onOpenStore?.(product.storeId ?? product.store)}
          >
            {product.store}
          </button>

          <div className="price-row">
            <span className="current-price">{product.currentPrice.toLocaleString()}원</span>
            <span className="original-price">{product.originalPrice.toLocaleString()}원</span>
          </div>

          <div className="price-meta">
            <span>하락률 {product.discountRate}%</span>
            <span>시작가 {product.startPrice.toLocaleString()}원</span>
            <span>하락폭 {product.dropAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      <TrendChart data={product.trend} />

      <div className="pickup-action-row">
        <span className="pickup-time">픽업 가능 시간 {product.pickupTime}</span>

        <div className="product-action-buttons">
          <button
            className="ghost-outline-button product-card-action-button"
            onClick={() => onOpenDetail(product)}
          >
            상세보기
          </button>
          <button
            className="primary-button product-card-action-button"
            onClick={() => onReserve(product)}
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard