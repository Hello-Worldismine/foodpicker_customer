import { useState } from 'react'
import { Bell, BellOff, Heart } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'

function FavoritesPage({
  favoriteItems = [],
  onOpenAlertModal,
  alertSettings = {},
  onCancelAlertSetting,
  onOpenDetail,
  onReserve,
  onOpenStore,
  onToggleFavorite,
}) {
  const [openAlertId, setOpenAlertId] = useState(null)

  const safeFavoriteItems = favoriteItems.filter(Boolean)

  return (
    <div className="page">
      <PageHeader title="관심/찜" />

      {safeFavoriteItems.length === 0 ? (
        <EmptyState title="아직 찜한 상품이 없어요!" />
      ) : (
        <div className="stack-list">
          {safeFavoriteItems.map((item) => {
            const itemAlertSettings = alertSettings[item.id] || {}
            const isAlertOpen = openAlertId === item.id

            const imageSrc =
              item.image || 'https://placehold.co/800x500?text=No+Image'
            const currentPrice = item.currentPrice ?? item.price ?? 0
            const originalPrice = item.originalPrice ?? 0
            const startPrice = item.startPrice ?? currentPrice
            const dropAmount =
              item.dropAmount ?? Math.max(startPrice - currentPrice, 0)
            const discountRate = item.discountRate ?? 0
            const favoriteCount = item.favoriteCount ?? 0
            const productName = item.name ?? '상품명 없음'
            const storeName = item.store ?? ''
            const categoryName = item.category ?? '카테고리'
            const pickupTime = item.pickupTime ?? '픽업 시간 미정'

            return (
              <SectionCard key={item.id} className="favorite-product-card">
                <div className="product-card-top-image favorite-top-image-card">
                  <div className="product-card-image-wrap">
                    <img
                      className="product-card-cover-image"
                      src={imageSrc}
                      alt={productName}
                    />

                    <div className="product-card-image-overlay">
                      <div className="rank-badge compact">찜한 상품</div>

                      <button
                        className="favorite-icon-button active"
                        onClick={() => onToggleFavorite?.(item)}
                        aria-label="찜 해제"
                        type="button"
                      >
                        <Heart size={18} fill="currentColor" />
                        <span className="favorite-count">{favoriteCount}</span>
                      </button>
                    </div>
                  </div>

                  <div className="product-card-body">
                    <div className="product-info">
                      <p className="product-category">{categoryName}</p>
                      <h3 className="product-name">{productName}</h3>

                      <button
                        className="store-link-button"
                        onClick={() => onOpenStore?.(item.storeId ?? storeName)}
                        type="button"
                      >
                        {storeName}
                      </button>

                      <div className="price-row">
                        <span className="current-price">
                          {currentPrice.toLocaleString()}원
                        </span>
                        <span className="original-price">
                          {originalPrice.toLocaleString()}원
                        </span>
                      </div>

                      <div className="price-meta">
                        <span>하락률 {discountRate}%</span>
                        <span>시작가 {startPrice.toLocaleString()}원</span>
                        <span>하락폭 {dropAmount.toLocaleString()}원</span>
                      </div>
                    </div>

                    <div className="pickup-action-row favorite-pickup-row">
                      <span className="pickup-time">픽업 가능 시간 {pickupTime}</span>

                      <div className="product-action-buttons">
                        <button
                          className="ghost-outline-button favorite-action-button"
                          onClick={() => onOpenDetail?.(item)}
                          type="button"
                        >
                          상세보기
                        </button>
                        <button
                          className="primary-button favorite-action-button"
                          onClick={() => onReserve?.(item)}
                          type="button"
                        >
                          예약하기
                        </button>
                        <button
                          className={`ghost-outline-button favorite-action-button alert-toggle-button ${
                            isAlertOpen ? 'active' : ''
                          }`}
                          onClick={() =>
                            setOpenAlertId((prev) => (prev === item.id ? null : item.id))
                          }
                          type="button"
                        >
                          <Bell size={14} />
                          알림설정
                        </button>
                      </div>
                    </div>

                    {isAlertOpen && (
                      <div className="favorite-alert-panel">
                        <div className="store-info-vertical favorite-store-info">
                          <p><strong>매장명</strong> {storeName}</p>
                          <p><strong>주소</strong> {item.address ?? '-'}</p>
                          <p><strong>연락처</strong> {item.contact ?? '-'}</p>
                        </div>

                        <div className="favorite-alert-section">
                          <h4>알림 설정</h4>

                          <div className="favorite-alert-setting-list">
                            <div className="favorite-alert-setting-item">
                              <div className="favorite-alert-setting-text">
                                <span className="saved-alert-type">지정가 알림</span>
                                {itemAlertSettings.targetPrice ? (
                                  <strong>{itemAlertSettings.targetPrice.label}</strong>
                                ) : (
                                  <p>원하는 가격 이하가 되면 알려드려요.</p>
                                )}
                              </div>

                              {itemAlertSettings.targetPrice ? (
                                <button
                                  className="saved-alert-cancel"
                                  onClick={() =>
                                    onCancelAlertSetting?.(item.id, 'targetPrice', productName)
                                  }
                                  type="button"
                                >
                                  <BellOff size={14} />
                                  취소
                                </button>
                              ) : (
                                <button
                                  className="chip-button"
                                  onClick={() =>
                                    onOpenAlertModal?.({
                                      title: '지정가 알림 설정',
                                      description: '상품 가격이 설정 금액 이하가 되면 알림을 보냅니다.',
                                      label: '희망 가격',
                                      placeholder: '예: 3000',
                                      itemName: productName,
                                      itemId: item.id,
                                      settingType: 'targetPrice',
                                    })
                                  }
                                  type="button"
                                >
                                  설정
                                </button>
                              )}
                            </div>

                            <div className="favorite-alert-setting-item">
                              <div className="favorite-alert-setting-text">
                                <span className="saved-alert-type">재고소진 임박 알림</span>
                                {itemAlertSettings.lowStock ? (
                                  <strong>{itemAlertSettings.lowStock.label}</strong>
                                ) : (
                                  <p>재고가 얼마 남지 않았을 때 알려드려요.</p>
                                )}
                              </div>

                              {itemAlertSettings.lowStock ? (
                                <button
                                  className="saved-alert-cancel"
                                  onClick={() =>
                                    onCancelAlertSetting?.(item.id, 'lowStock', productName)
                                  }
                                  type="button"
                                >
                                  <BellOff size={14} />
                                  취소
                                </button>
                              ) : (
                                <button
                                  className="chip-button"
                                  onClick={() =>
                                    onOpenAlertModal?.({
                                      title: '재고소진 임박 알림 설정',
                                      description: '재고가 얼마 남지 않았을 때 알림을 보냅니다.',
                                      label: '재고 기준',
                                      placeholder: '예: 2',
                                      itemName: productName,
                                      itemId: item.id,
                                      settingType: 'lowStock',
                                    })
                                  }
                                  type="button"
                                >
                                  설정
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage