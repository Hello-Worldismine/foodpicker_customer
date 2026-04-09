import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'
import ProductCard from '../components/home/ProductCard'
import EmptyState from '../components/common/EmptyState'

function StorePage({
  store,
  products,
  onBackHome,
  onOpenDetail,
  onReserve,
  onToggleFavorite,
  favoriteItems,
  onOpenStore,
}) {
  if (!store) {
    return (
      <div className="page">
        <PageHeader title="가게" />
        <EmptyState title="가게 정보를 찾을 수 없어요." />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHeader title="가게" />

      <SectionCard>
        <div className="store-page-header">
          <div>
            <h2 className="store-page-title">{store.name}</h2>
            <p className="store-page-region">{store.region}</p>
          </div>

          <button
            className="ghost-outline-button store-page-home-button"
            onClick={onBackHome}
          >
            홈으로
          </button>
        </div>

        <div className="store-page-info">
          <p><strong>주소</strong> {store.address}</p>
          <p><strong>연락처</strong> {store.contact}</p>
          <p><strong>소개</strong> {store.description}</p>
        </div>

        <div className="mini-map">📍 {store.name} 지도 영역</div>
      </SectionCard>

      <div className="section-title-row">
        <h2>판매 중 상품</h2>
      </div>

      {products.length === 0 ? (
        <EmptyState title="현재 판매중인 상품이 없습니다." />
      ) : (
        <div className="product-list">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              rank={index + 1}
              onReserve={onReserve}
              onToggleFavorite={onToggleFavorite}
              onOpenDetail={onOpenDetail}
              onOpenStore={onOpenStore}
              isFavorite={favoriteItems.some(
                (item) => item.name === product.name && item.storeId === product.storeId,
              )}
              compactRank
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StorePage