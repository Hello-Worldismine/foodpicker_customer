import { useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'

function FavoritesPage({ favoriteItems, onOpenAlertModal }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="page">
      <PageHeader title="관심/찜" />

      {favoriteItems.length === 0 ? (
        <EmptyState title="아직 찜한 상품이 없어요!" />
      ) : (
        <div className="stack-list">
          {favoriteItems.map((item) => (
            <SectionCard key={item.id}>
              <div
                className="favorite-row"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                <img src={item.image} alt={item.name} />
                <div className="favorite-main">
                  <h3>{item.name}</h3>
                  <p>{item.store}</p>
                  <strong>{item.price.toLocaleString()}원</strong>
                </div>
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
                          })
                        }
                      >
                        지정가 알림 설정
                      </button>

                      <button
                        className="chip-button"
                        onClick={() =>
                          onOpenAlertModal({
                            title: '할인율 알림설정',
                            description: '설정한 할인율 이상이 되면 알림을 보냅니다.',
                            label: '희망 할인율(%)',
                            placeholder: '예: 50',
                            itemName: item.name,
                          })
                        }
                      >
                        할인율 알림설정
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
                          })
                        }
                      >
                        재고소진 임박 알림 설정
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage