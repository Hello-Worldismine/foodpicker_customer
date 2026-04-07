import { useMemo, useState } from 'react'
import BottomNav from './components/common/BottomNav'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import FavoritesPage from './pages/FavoritesPage'
import OrdersPage from './pages/OrdersPage'
import MyPage from './pages/MyPage'
import PaymentPage from './pages/PaymentPage'
import { homePopularProducts, stores, favoriteItems, pickupOrders, myOrders } from './data/mockData'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedPaymentItem, setSelectedPaymentItem] = useState(null)
  const [favoriteAlertModal, setFavoriteAlertModal] = useState(null)
  const [myPageOrderDetail, setMyPageOrderDetail] = useState(null)

  const paymentProduct = useMemo(() => {
    return selectedPaymentItem || homePopularProducts[0]
  }, [selectedPaymentItem])

  const openPaymentPage = (product) => {
    setSelectedPaymentItem(product)
    setActiveTab('payment')
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            products={homePopularProducts}
            onReserve={openPaymentPage}
          />
        )
      case 'map':
        return (
          <MapPage
            stores={stores}
            onPayNow={openPaymentPage}
          />
        )
      case 'favorites':
        return (
          <FavoritesPage
            favoriteItems={favoriteItems}
            onOpenAlertModal={setFavoriteAlertModal}
          />
        )
      case 'orders':
        return <OrdersPage pickupOrders={pickupOrders} />
      case 'mypage':
        return (
          <MyPage
            orders={myOrders}
            onOpenOrderDetail={setMyPageOrderDetail}
          />
        )
      case 'payment':
        return (
          <PaymentPage
            product={paymentProduct}
            onBack={() => setActiveTab('home')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      <div className="mobile-app">
        {renderPage()}

        {activeTab !== 'payment' && (
          <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        )}
      </div>

      {favoriteAlertModal && (
        <div className="overlay">
          <div className="popup-card">
            <h3 className="popup-title">{favoriteAlertModal.title}</h3>
            <p className="popup-subtitle">{favoriteAlertModal.description}</p>

            <div className="form-group">
              <label>{favoriteAlertModal.label}</label>
              <input
                className="text-input"
                type="number"
                placeholder={favoriteAlertModal.placeholder}
              />
            </div>

            <div className="popup-actions">
              <button
                className="ghost-button"
                onClick={() => setFavoriteAlertModal(null)}
              >
                취소
              </button>
              <button
                className="primary-button"
                onClick={() => setFavoriteAlertModal(null)}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {myPageOrderDetail && (
        <div className="overlay">
          <div className="popup-card detail-popup">
            <div className="popup-header-row">
              <h3 className="popup-title">주문 상세</h3>
              <button
                className="icon-close"
                onClick={() => setMyPageOrderDetail(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-order-meta">
              <p><strong>주문 번호</strong> {myPageOrderDetail.orderNumber}</p>
              <p><strong>주문 날짜</strong> {myPageOrderDetail.orderDate}</p>
            </div>

            <div className="detail-product-box">
              <img src={myPageOrderDetail.image} alt={myPageOrderDetail.name} />
              <div>
                <h4>{myPageOrderDetail.name}</h4>
                <p>구매가 {myPageOrderDetail.price.toLocaleString()}원</p>
                <p>{myPageOrderDetail.store}</p>
                <p>{myPageOrderDetail.address}</p>
              </div>
            </div>

            <div className="mini-map">📍 {myPageOrderDetail.store} 위치 지도 영역</div>

            {myPageOrderDetail.status === '픽업 완료' && (
              <>
                <p className="pickup-complete-time">
                  픽업 완료 일시 : {myPageOrderDetail.pickedUpAt}
                </p>
                <button className="primary-button full-width">리뷰쓰기</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App