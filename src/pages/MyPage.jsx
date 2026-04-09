import { Bell, MapPin, Mail, Phone, BadgeCheck, Pencil } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'

function MyPage({ orders, onOpenOrderDetail }) {
  const waitingOrders = orders.filter((order) => order.status === '픽업대기')
  const doneOrders = orders.filter((order) => order.status === '픽업 완료')

  const enrichedOrders = orders.map((order, index) => ({
    ...order,
    pickupCode: order.pickupCode || `FP-${String(2108 + index).padStart(4, '0')}`,
    quantityText: order.quantityText || (order.status === '픽업대기' ? '동일 상품 2개' : '1인 세트 1개'),
    oldPrice: order.oldPrice || Math.round(order.price * 1.45),
  }))

  return (
    <div className="page mypage-redesign">
      <div className="mypage-topbar">
        <div className="mypage-location">
          <MapPin size={18} />
          <span>서교동</span>
        </div>

        <button className="mypage-noti-button" aria-label="알림">
          <Bell size={18} />
        </button>
      </div>

      <div className="mypage-profile-section">
        <div className="mypage-avatar-wrap">
          <img
            className="mypage-avatar"
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="프로필"
          />
          <button className="mypage-avatar-edit" aria-label="프로필 수정">
            <Pencil size={14} />
          </button>
        </div>

        <div className="mypage-profile-meta">
          <h2>김지아</h2>
          <p>010-1234-5678</p>
          <div className="mypage-member-badge">
            <BadgeCheck size={14} />
            <span>Gold Member</span>
          </div>
        </div>
      </div>

      <div className="mypage-summary-card">
        <div className="mypage-summary-item active">
          <span>전체 주문</span>
          <strong>{orders.length + 22}</strong>
        </div>
        <div className="mypage-summary-item">
          <span>리뷰</span>
          <strong>{doneOrders.length + 16}</strong>
        </div>
        <div className="mypage-summary-item">
          <span>포인트</span>
          <strong>4,200</strong>
        </div>
      </div>

      <div className="mypage-order-header">
        <h3>주문 내역</h3>
        <button className="mypage-view-all">전체보기</button>
      </div>

      <div className="mypage-order-list">
        {enrichedOrders.map((order, index) => (
          <div key={order.id} className="mypage-order-card">
            <div className="mypage-order-top">
              <span className="mypage-order-time">
                {index === 0 ? '오늘 오후 12:30' : index === 1 ? '어제 오후 6:15' : '10월 24일 오후 1:10'}
              </span>
              <span className={`mypage-order-status ${order.status === '픽업대기' ? 'waiting' : 'done'}`}>
                {order.status}
              </span>
            </div>

            <button
              className="mypage-order-main"
              onClick={() => onOpenOrderDetail(order)}
            >
              <img src={order.image} alt={order.name} className="mypage-order-image" />

              <div className="mypage-order-info">
                <h4>{order.store}</h4>
                <p>{order.name} {order.quantityText}</p>

                <div className="mypage-order-price-row">
                  <strong>{order.price.toLocaleString()}원</strong>
                  <span>{order.oldPrice.toLocaleString()}원</span>
                </div>
              </div>
            </button>

            {order.status === '픽업대기' ? (
              <div className="mypage-order-action-box">
                <div className="mypage-pickup-code">
                  픽업 코드 &nbsp; <strong>{order.pickupCode}</strong>
                </div>
              </div>
            ) : (
              <>
                <div className="mypage-pickedup-info">
                  <span>픽업 완료 일시</span>
                  <strong>{order.pickedUpAt || '2023.10.26 19:20'}</strong>
                </div>

                <button className="mypage-review-button">리뷰 쓰기</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mypage-earth-card">
        <div className="mypage-earth-text">
          <h4>지아님의 지구 사랑</h4>
          <p>지금까지 3.2kg의 음식 낭비를 막았습니다.</p>
        </div>

        <div className="mypage-earth-progress">
          <div className="mypage-earth-progress-bar" />
        </div>

        <span className="mypage-earth-caption">NEXT MILESTONE : 5KG SAVING</span>
      </div>
    </div>
  )
}

export default MyPage