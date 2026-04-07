import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'

function OrdersPage({ pickupOrders }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="page">
      <PageHeader title="주문" />

      <div className="section-title-row">
        <h2>픽업가능리스트</h2>
      </div>

      <SectionCard>
        <div className="order-table-header">
          <span>상품명</span>
          <span>상품수량</span>
          <span>매장명</span>
          <span>픽업생성코드</span>
        </div>

        {pickupOrders.map((item) => (
          <div key={item.id}>
            <div className="order-table-row">
              <button
                className="link-button"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                {item.name}
              </button>
              <span>{item.quantity}</span>
              <span>{item.store}</span>
              <span>{item.code}</span>
            </div>

            {openId === item.id && (
              <div className="accordion-box order-accordion">
                <div className="store-info-vertical">
                  <p><strong>매장명</strong> {item.store}</p>
                  <p><strong>주소</strong> {item.address}</p>
                  <p><strong>연락처</strong> {item.contact}</p>
                </div>
                <div className="mini-map">📍 {item.store} 지도 영역</div>
              </div>
            )}
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

export default OrdersPage