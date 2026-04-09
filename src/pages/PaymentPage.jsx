import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, ChevronUp, MoreHorizontal, Plus } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'

const cardOptions = [
  { id: 'shinhan', name: '신한카드 (1234)', sub: '일시불 결제', colorClass: 'card-color-shinhan' },
  { id: 'kb', name: 'KB국민카드', sub: '일시불 결제', colorClass: 'card-color-kb' },
  { id: 'hyundai', name: '현대카드', sub: '일시불 결제', colorClass: 'card-color-hyundai' },
  { id: 'samsung', name: '삼성카드', sub: '일시불 결제', colorClass: 'card-color-samsung' },
]

function PaymentPage({ product, onBack }) {
  const [selectedCardId, setSelectedCardId] = useState('shinhan')
  const [isCardOpen, setIsCardOpen] = useState(false)

  const selectedCard = useMemo(
    () => cardOptions.find((card) => card.id === selectedCardId) ?? cardOptions[0],
    [selectedCardId],
  )

  const originalPrice = product?.originalPrice ?? Math.round((product?.currentPrice ?? 0) * 1.25)
  const currentPrice = product?.currentPrice ?? product?.price ?? 0
  const discountAmount = originalPrice - currentPrice

  return (
    <div className="page payment-screen">
      <div className="payment-top-header">
        <button className="payment-header-icon" onClick={onBack} aria-label="뒤로가기">
          <ArrowLeft size={24} />
        </button>
        <h1>주문/결제</h1>
        <button className="payment-header-icon" aria-label="더보기">
          <MoreHorizontal size={22} />
        </button>
      </div>

      <div className="page-divider" />

      <section className="payment-block">
        <h2 className="payment-section-title">선택 상품</h2>

        <div className="payment-product-card">
          <img
            className="payment-product-image"
            src={product?.image}
            alt={product?.name}
          />

          <div className="payment-product-info">
            <span className="payment-discount-badge">특별할인</span>
            <h3>{product?.name}</h3>
            <p className="payment-store-name">{product?.store}</p>

            <div className="payment-product-price-row">
              <strong>{currentPrice.toLocaleString()}원</strong>
              <span>{originalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </section>

      <section className="payment-block">
        <h2 className="payment-section-title">결제 수단</h2>

        <div className={`payment-method-card ${isCardOpen ? 'open' : ''}`}>
          <button
            className="payment-method-selected"
            onClick={() => setIsCardOpen((prev) => !prev)}
          >
            <div className="payment-method-left">
              <div className={`payment-card-chip ${selectedCard.colorClass}`} />
              <div>
                <strong>{selectedCard.name}</strong>
                <p>{selectedCard.sub}</p>
              </div>
            </div>

            <span className="payment-method-arrow">
              {isCardOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </span>
          </button>

          {isCardOpen && (
            <div className="payment-method-options">
              {cardOptions.map((card) => (
                <button
                  key={card.id}
                  className="payment-method-option"
                  onClick={() => {
                    setSelectedCardId(card.id)
                    setIsCardOpen(false)
                  }}
                >
                  <div className="payment-method-left">
                    <div className={`payment-card-chip ${card.colorClass}`} />
                    <div>
                      <strong>{card.name}</strong>
                    </div>
                  </div>

                  {selectedCardId === card.id && (
                    <span className="payment-method-check">
                      <Check size={18} />
                    </span>
                  )}
                </button>
              ))}

              <button className="payment-method-option payment-method-add">
                <div className="payment-method-left">
                  <span className="payment-add-icon">
                    <Plus size={16} />
                  </span>
                  <div>
                    <strong>다른 카드 등록</strong>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="payment-summary-card">
        <div className="payment-summary-row">
          <span>주문 금액</span>
          <strong>{originalPrice.toLocaleString()}원</strong>
        </div>
        <div className="payment-summary-row">
          <span>할인 금액</span>
          <strong className="payment-discount-text">
            -{discountAmount.toLocaleString()}원
          </strong>
        </div>
        <div className="payment-summary-row">
          <span>배달비</span>
          <strong>0원</strong>
        </div>

        <div className="payment-summary-divider" />

        <div className="payment-final-row">
          <span>최종 결제 금액</span>
          <strong>{currentPrice.toLocaleString()}원</strong>
        </div>
      </section>

      <section className="payment-eco-card">
        <div className="payment-eco-icon">🍃</div>
        <p>
          이 구출 식사를 선택함으로써 <strong>0.8kg의 이산화탄소</strong> 배출을
          방지하고 있습니다. 가치 있는 선택에 감사드립니다!
        </p>
      </section>

      <div className="payment-submit-wrap">
        <button className="payment-submit-button">결제하기</button>
      </div>
    </div>
  )
}

export default PaymentPage