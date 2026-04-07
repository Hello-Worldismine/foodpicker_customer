import { useMemo, useState } from 'react'
import { Bell, X } from 'lucide-react'
import BottomNav from './components/common/BottomNav'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import FavoritesPage from './pages/FavoritesPage'
import OrdersPage from './pages/OrdersPage'
import MyPage from './pages/MyPage'
import PaymentPage from './pages/PaymentPage'
import {
  homePopularProducts,
  stores,
  favoriteItems as initialFavoriteItems,
  pickupOrders,
  myOrders,
} from './data/mockData'


function App() {
  const [selectedProductDetail, setSelectedProductDetail] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [selectedPaymentItem, setSelectedPaymentItem] = useState(null)
  const [favoriteAlertModal, setFavoriteAlertModal] = useState(null)
  const [alertInputValue, setAlertInputValue] = useState('')
  const [myPageOrderDetail, setMyPageOrderDetail] = useState(null)
  const [favoriteItems, setFavoriteItems] = useState(initialFavoriteItems)
  const [alertSettings, setAlertSettings] = useState({})
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '할인 알림',
      message: '딸기 생크림 케이크 조각이 3,900원으로 내려갔어요.',
      time: '방금 전',
      read: false,
    },
  ])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const paymentProduct = useMemo(() => {
    return selectedPaymentItem || homePopularProducts[0]
  }, [selectedPaymentItem])

  const unreadCount = notifications.filter((item) => !item.read).length

  const addNotification = (title, message) => {
    const newItem = {
      id: Date.now(),
      title,
      message,
      time: '방금 전',
      read: false,
    }
    setNotifications((prev) => [newItem, ...prev])
  }

  const openPaymentPage = (product) => {
    setSelectedPaymentItem(product)
    setActiveTab('payment')
  }

  const toggleFavorite = (product) => {
    const exists = favoriteItems.some(
      (item) => item.name === product.name && item.store === product.store,
    )

    if (exists) {
      const removedItem = favoriteItems.find(
        (item) => item.name === product.name && item.store === product.store,
      )

      setFavoriteItems((prev) =>
        prev.filter((item) => !(item.name === product.name && item.store === product.store)),
      )

      if (removedItem) {
        setAlertSettings((prev) => {
          const next = { ...prev }
          delete next[removedItem.id]
          return next
        })
      }

      addNotification('찜 해제', `${product.name} 상품이 관심 목록에서 제거되었어요.`)
      return
    }

    const newFavorite = {
      id: Date.now(),
      name: product.name,
      store: product.store,
      price: product.currentPrice,
      image: product.image,
      address: product.address || '서울 마포구 서교동 11-2',
      contact: product.contact || '02-000-0000',
    }

    setFavoriteItems((prev) => [newFavorite, ...prev])
    addNotification('찜 완료', `${product.name} 상품을 관심 목록에 추가했어요.`)
  }

  const openAlertModal = (modalInfo) => {
    const currentValue =
      alertSettings[modalInfo.itemId]?.[modalInfo.settingType]?.value ?? ''

    setFavoriteAlertModal(modalInfo)
    setAlertInputValue(String(currentValue))
  }

  const closeAlertModal = () => {
    setFavoriteAlertModal(null)
    setAlertInputValue('')
  }

  const saveAlertSetting = () => {
    if (!favoriteAlertModal || !alertInputValue.trim()) return

    const numericValue = Number(alertInputValue)

    if (Number.isNaN(numericValue) || numericValue <= 0) return

    setAlertSettings((prev) => ({
      ...prev,
      [favoriteAlertModal.itemId]: {
        ...prev[favoriteAlertModal.itemId],
        [favoriteAlertModal.settingType]: {
          value: numericValue,
          label:
            favoriteAlertModal.settingType === 'targetPrice'
              ? `${numericValue.toLocaleString()}원 이하 알림`
              : `재고 ${numericValue}개 이하 알림`,
        },
      },
    }))

    addNotification(
      favoriteAlertModal.title,
      `${favoriteAlertModal.itemName} 상품의 ${favoriteAlertModal.title}이 저장되었어요.`,
    )

    closeAlertModal()
  }

  const cancelAlertSetting = (itemId, settingType, itemName) => {
    setAlertSettings((prev) => {
      const itemSettings = prev[itemId]
      if (!itemSettings) return prev

      const nextItemSettings = { ...itemSettings }
      delete nextItemSettings[settingType]

      const next = { ...prev }
      if (Object.keys(nextItemSettings).length === 0) {
        delete next[itemId]
      } else {
        next[itemId] = nextItemSettings
      }

      return next
    })

    addNotification(
      '알림 설정 취소',
      `${itemName} 상품의 ${
        settingType === 'targetPrice' ? '지정가 알림' : '재고소진 임박 알림'
      }이 취소되었어요.`,
    )
  }

  const openNotifications = () => {
    setIsNotificationOpen(true)
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
  return (
    <HomePage
      products={homePopularProducts}
      onReserve={openPaymentPage}
      onToggleFavorite={toggleFavorite}
      favoriteItems={favoriteItems}
      onOpenNotifications={openNotifications}
      unreadCount={unreadCount}
      onOpenProductDetail={setSelectedProductDetail}
    />
  )

      case 'map':
        return <MapPage stores={stores} onPayNow={openPaymentPage} />

      case 'favorites':
        return (
          <FavoritesPage
            favoriteItems={favoriteItems}
            onOpenAlertModal={openAlertModal}
            alertSettings={alertSettings}
            onCancelAlertSetting={cancelAlertSetting}
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
                value={alertInputValue}
                onChange={(e) => setAlertInputValue(e.target.value)}
              />
            </div>

            <div className="popup-actions">
              <button className="ghost-button" onClick={closeAlertModal}>
                취소
              </button>
              <button className="primary-button" onClick={saveAlertSetting}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {isNotificationOpen && (
        <div className="overlay">
          <div className="popup-card notification-popup">
            <div className="popup-header-row">
              <h3 className="popup-title">알림</h3>
              <button className="icon-close" onClick={() => setIsNotificationOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <p className="notification-empty">아직 도착한 알림이 없어요.</p>
              ) : (
                notifications.map((item) => (
                  <div key={item.id} className="notification-item">
                    <div className="notification-icon-wrap">
                      <Bell size={16} />
                    </div>
                    <div className="notification-content">
                      <strong>{item.title}</strong>
                      <p>{item.message}</p>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

{selectedProductDetail && (
  <div className="overlay">
    <div className="popup-card detail-popup product-detail-popup">
      <div className="popup-header-row">
        <h3 className="popup-title">상품 상세보기</h3>
        <button
          className="icon-close"
          onClick={() => setSelectedProductDetail(null)}
        >
          ✕
        </button>
      </div>

      <div className="product-detail-gallery">
        {selectedProductDetail.gallery?.map((image, index) => (
          <img
            key={`${selectedProductDetail.id}-${index}`}
            src={image}
            alt={`${selectedProductDetail.name} ${index + 1}`}
          />
        ))}
      </div>

      <div className="product-detail-section">
        <h4>{selectedProductDetail.name}</h4>
        <p>{selectedProductDetail.description}</p>
      </div>

      <div className="product-detail-grid">
        <div className="detail-info-card">
          <span className="detail-label">카테고리</span>
          <strong>{selectedProductDetail.category}</strong>
        </div>
        <div className="detail-info-card">
          <span className="detail-label">수량</span>
          <strong>{selectedProductDetail.quantity}개</strong>
        </div>
        <div className="detail-info-card">
          <span className="detail-label">시작가</span>
          <strong>{selectedProductDetail.startPrice.toLocaleString()}원</strong>
        </div>
        <div className="detail-info-card">
          <span className="detail-label">최저가</span>
          <strong>{selectedProductDetail.minimumPrice.toLocaleString()}원</strong>
        </div>
        <div className="detail-info-card">
          <span className="detail-label">현재가</span>
          <strong>{selectedProductDetail.currentPrice.toLocaleString()}원</strong>
        </div>
        <div className="detail-info-card">
          <span className="detail-label">가격 인하 간격</span>
          <strong>{selectedProductDetail.priceDropInterval}</strong>
        </div>
      </div>

      <div className="product-detail-section">
        <h5>판매자 등록 정보</h5>
        <div className="detail-list">
          <p><strong>매장명</strong> {selectedProductDetail.store}</p>
          <p><strong>주소</strong> {selectedProductDetail.address}</p>
          <p><strong>연락처</strong> {selectedProductDetail.contact}</p>
          <p><strong>픽업 가능 시간</strong> {selectedProductDetail.pickupTime}</p>
          <p><strong>상품 안내</strong> {selectedProductDetail.expirationNote}</p>
        </div>
      </div>

      <div className="product-detail-section">
        <h5>가격 변동 이력</h5>
        <div className="detail-price-history">
          {selectedProductDetail.trend.map((item) => (
            <div key={`${item.time}-${item.price}`} className="detail-price-history-row">
              <span>{item.time}</span>
              <strong>{item.price.toLocaleString()}원</strong>
            </div>
          ))}
        </div>
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