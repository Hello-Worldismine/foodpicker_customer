import { useState } from 'react'
import { BellOff } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'

function FavoritesPage({
  favoriteItems,
  onOpenAlertModal,
  alertSettings,
  onCancelAlertSetting,
  onOpenDetail,
  onReserve,
  onOpenStore,
}) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="page">
      <PageHeader title="관심/찜" />

      {favoriteItems.length === 0 ? (
        <EmptyState title="아직 찜한 상품이 없어요!" />
      ) : (
        <div className="stack-list">
          {favoriteItems.map((item) => {
            const itemAlertSettings = alertSettings[item.id] || {}

            return (
              <SectionCard key={item.id}>
                <div
                  className="favorite-row"
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="favorite-main">
                    <h3>{item.name}</h3>
                    <button
                      className="store-link-button favorite-store-link"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenStore(item.storeId ?? item.store)
                      }}
                    >
                      {item.store}
                    </button>
                    <strong>{item.price.toLocaleString()}원</strong>
                  </div>
                </div>

                <div className="favorite-card-actions">
                  <button
                    className="ghost-outline-button favorite-action-button"
                    onClick={() => onOpenDetail(item)}
                  >
                    상세보기
                  </button>
                  <button
                    className="primary-button favorite-action-button"
                    onClick={() => onReserve(item)}
                  >
                    예약하기
                  </button>
                </div>

                {openId === item.id && (
                  <div className="accordion-box">
                    <div className="store-info-vertical">
                      <p><strong>매장명</strong> {item.store}</p>
                      <p><strong>주소</strong> {item.address}</p>
                      <p><strong>연락처</strong> {item.contact}</p>
                    </div>

                    <div className="alert-setting-box">
                      <h4>알림설정</h4>

                      <div className="alert-buttons">
                        <button
                          className="chip-button"
                          onClick={() =>
                            onOpenAlertModal({
                              title: '지정가 알림 설정',
                              description: '상품 가격이 설정 금액 이하가 되면 알림을 보냅니다.',
                              label: '희망 가격',
                              placeholder: '예: 3000',
                              itemName: item.name,
                              itemId: item.id,
                              settingType: 'targetPrice',
                            })
                          }
                        >
                          지정가 알림 설정
                        </button>

                        <button
                          className="chip-button"
                          onClick={() =>
                            onOpenAlertModal({
                              title: '재고소진 임박 알림 설정',
                              description: '재고가 얼마 남지 않았을 때 알림을 보냅니다.',
                              label: '재고 기준',
                              placeholder: '예: 2',
                              itemName: item.name,
                              itemId: item.id,
                              settingType: 'lowStock',
                            })
                          }
                        >
                          재고소진 임박 알림 설정
                        </button>
                      </div>

                      <div className="saved-alert-section">
                        <h5>현재 설정된 알림</h5>

                        {Object.keys(itemAlertSettings).length === 0 ? (
                          <div className="saved-alert-empty">
                            아직 설정된 알림이 없어요.
                          </div>
                        ) : (
                          <div className="saved-alert-list">
                            {itemAlertSettings.targetPrice && (
                              <div className="saved-alert-item">
                                <div className="saved-alert-info">
                                  <span className="saved-alert-type">지정가 알림</span>
                                  <strong>{itemAlertSettings.targetPrice.label}</strong>
                                </div>
                                <button
                                  className="saved-alert-cancel"
                                  onClick={() =>
                                    onCancelAlertSetting(item.id, 'targetPrice', item.name)
                                  }
                                >
                                  <BellOff size={14} />
                                  취소
                                </button>
                              </div>
                            )}

                            {itemAlertSettings.lowStock && (
                              <div className="saved-alert-item">
                                <div className="saved-alert-info">
                                  <span className="saved-alert-type">재고소진 임박 알림</span>
                                  <strong>{itemAlertSettings.lowStock.label}</strong>
                                </div>
                                <button
                                  className="saved-alert-cancel"
                                  onClick={() =>
                                    onCancelAlertSetting(item.id, 'lowStock', item.name)
                                  }
                                >
                                  <BellOff size={14} />
                                  취소
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage