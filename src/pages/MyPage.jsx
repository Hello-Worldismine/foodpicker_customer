import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'

function MyPage({ orders, onOpenOrderDetail }) {
  return (
    <div className="page">
      <PageHeader title="마이페이지" />

      <SectionCard>
        <div className="profile-box">
          <div className="profile-image-upload">＋</div>
          <div className="profile-meta">
            <p><strong>이름</strong> 김푸드</p>
            <p><strong>닉네임</strong> 푸드피커러버</p>
            <p><strong>연락처</strong> 010-1234-5678</p>
          </div>
        </div>
      </SectionCard>

      <div className="section-title-row">
        <h2>주문 내역</h2>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="아직 주문한 상품이 없어요!" />
      ) : (
        <div className="stack-list">
          {orders.map((order) => (
            <SectionCard key={order.id}>
              <button
                className="my-order-card"
                onClick={() => onOpenOrderDetail(order)}
              >
                <div className="my-order-top">
                  <div>
                    <h3>{order.name}</h3>
                    <p>{order.orderDate}</p>
                    <p>{order.store}</p>
                  </div>
                  <span className={`status-badge ${order.status === '픽업 완료' ? 'done' : 'waiting'}`}>
                    {order.status}
                  </span>
                </div>
              </button>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyPage