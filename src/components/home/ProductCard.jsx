import TrendChart from '../common/TrendChart'

function ProductCard({ product, rank, onReserve }) {
  return (
    <div className="product-card">
      <div className="rank-badge">{rank}순위</div>

      <div className="product-top-row">
        <img className="product-image" src={product.image} alt={product.name} />
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-store">{product.store}</p>

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
        <button className="primary-button" onClick={() => onReserve(product)}>
          예약하기
        </button>
      </div>
    </div>
  )
}

export default ProductCard