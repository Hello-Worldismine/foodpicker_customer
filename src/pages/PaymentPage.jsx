import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'

function PaymentPage({ product, onBack }) {
  const [cardCompany, setCardCompany] = useState('신한카드')

  return (
    <div className="page payment-page">
      <PageHeader title="주문/결제" />

      <SectionCard>
        <div className="payment-product">
          <img src={product.image} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p>{product.store}</p>
            <strong>{product.currentPrice?.toLocaleString()}원</strong>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="section-title-row">
          <h2>결제 수단</h2>
        </div>

        <div className="form-group">
          <label>카드사 선택</label>
          <select
            className="text-input"
            value={cardCompany}
            onChange={(e) => setCardCompany(e.target.value)}
          >
            <option>신한카드</option>
            <option>국민카드</option>
            <option>삼성카드</option>
            <option>현대카드</option>
            <option>우리카드</option>
            <option>하나카드</option>
            <option>롯데카드</option>
          </select>
        </div>
      </SectionCard>

      <div className="payment-footer-box">
        <div>
          <p className="payment-total-label">최종 결제 금액</p>
          <strong className="payment-total-price">
            {product.currentPrice?.toLocaleString()}원
          </strong>
        </div>

        <div className="payment-actions">
          <button className="ghost-button" onClick={onBack}>이전</button>
          <button className="primary-button">결제하기</button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage