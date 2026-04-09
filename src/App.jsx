import { useMemo, useState } from 'react'
import { Bell, X } from 'lucide-react'
import BottomNav from './components/common/BottomNav'
import TrendChart from './components/common/TrendChart'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import FavoritesPage from './pages/FavoritesPage'
import MyPage from './pages/MyPage'
import PaymentPage from './pages/PaymentPage'
import StorePage from './pages/StorePage'
import {
  homePopularProducts,
  stores,
  favoriteItems as initialFavoriteItems,
  pickupOrders,
  myOrders,
} from './data/mockData'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedPaymentItem, setSelectedPaymentItem] = useState(null)
  const [selectedProductDetail, setSelectedProductDetail] = useState(null)
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
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

  const selectedStoreProducts = useMemo(() => {
    if (!selectedStore) return []
    return homePopularProducts
      .filter((product) => product.storeId === selectedStore.id && product.quantity > 0)
      .map((product) => {
        const store = stores.find((item) => item.id === product.storeId)
        return {
          ...product,
          store: store?.name ?? '',
          address: store?.address ?? '',
          contact: store?.contact ?? '',
        }
      })
  }, [selectedStore])

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

  const enrichProductWithStore = (product) => {
    const store = stores.find((item) => item.id === product.storeId)
    return {
      ...product,
      store: product.store || store?.name || '',
      address: product.address || store?.address || '서울 마포구 서교동 11-2',
      contact: product.contact || store?.contact || '02-000-0000',
    }
  }

  const openPaymentPage = (product) => {
    setSelectedPaymentItem(enrichProductWithStore(product))
    setActiveTab('payment')
  }

  const openStorePage = (storeValue) => {
    let matchedStore = null

    if (typeof storeValue === 'number') {
      matchedStore = stores.find((item) => item.id === storeValue)
    } else {
      const keyword = String(storeValue).trim().toLowerCase()
      matchedStore = stores.find((item) => item.name.toLowerCase().includes(keyword))
    }

    if (!matchedStore) {
      addNotification('검색 결과 없음', '입력한 가게를 찾을 수 없어요.')
      return
    }

    setSelectedStore(matchedStore)
    setActiveTab('store')
  }

  const toggleFavorite = (product) => {
    const enrichedProduct = enrichProductWithStore(product)

    const exists = favoriteItems.some(
      (item) => item.name === enrichedProduct.name && item.storeId === enrichedProduct.storeId,
    )

    if (exists) {
      const removedItem = favoriteItems.find(
        (item) => item.name === enrichedProduct.name && item.storeId === enrichedProduct.storeId,
      )

      setFavoriteItems((prev) =>
        prev.filter(
          (item) => !(item.name === enrichedProduct.name && item.storeId === enrichedProduct.storeId),
        ),
      )

      if (removedItem) {
        setAlertSettings((prev) => {
          const next = { ...prev }
          delete next[removedItem.id]
          return next
        })
      }

      addNotification('찜 해제', `${enrichedProduct.name} 상품이 관심 목록에서 제거되었어요.`)
      return
    }

    const newFavorite = {
      ...enrichedProduct,
      id: Date.now(),
      price: enrichedProduct.currentPrice,
    }

    setFavoriteItems((prev) => [newFavorite, ...prev])
    addNotification('찜 완료', `${enrichedProduct.name} 상품을 관심 목록에 추가했어요.`)
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
            products={homePopularProducts.map(enrichProductWithStore)}
            onReserve={openPaymentPage}
            onToggleFavorite={toggleFavorite}
            favoriteItems={favoriteItems}
            onOpenNotifications={openNotifications}
            unreadCount={unreadCount}
            onOpenProductDetail={(product) => setSelectedProductDetail(enrichProductWithStore(product))}
            onOpenStore={openStorePage}
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
              onOpenDetail={(product) => setSelectedProductDetail(enrichProductWithStore(product))}
              onReserve={openPaymentPage}
              onOpenStore={openStorePage}
              onToggleFavorite={toggleFavorite}
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

      case 'store':
        return (
          <StorePage
            store={selectedStore}
            products={selectedStoreProducts}
            onBackHome={() => setActiveTab('home')}
            onOpenDetail={(product) => setSelectedProductDetail(enrichProductWithStore(product))}
            onReserve={openPaymentPage}
            onToggleFavorite={toggleFavorite}
            favoriteItems={favoriteItems}
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
        {activeTab !== 'payment' && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
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
              <button className="ghost-button" onClick={closeAlertModal}>취소</button>
              <button className="primary-button" onClick={saveAlertSetting}>저장</button>
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

      {selectedPreviewImage && (
        <div className="overlay image-preview-overlay" onClick={() => setSelectedPreviewImage(null)}>
          <div className="image-preview-card" onClick={(e) => e.stopPropagation()}>
            <button className="image-preview-close" onClick={() => setSelectedPreviewImage(null)}>
              ✕
            </button>
            <img className="image-preview-large" src={selectedPreviewImage} alt="확대 이미지" />
          </div>
        </div>
      )}

      {selectedProductDetail && (
        <div className="overlay">
          <div className="popup-card detail-popup product-detail-popup">
            <div className="popup-header-row">
              <h3 className="popup-title">상품 상세보기</h3>
              <button className="icon-close" onClick={() => setSelectedProductDetail(null)}>✕</button>
            </div>

            <div className="product-detail-gallery">
              {selectedProductDetail.gallery?.map((image, index) => (
                <button
                  key={`${selectedProductDetail.id}-${index}`}
                  type="button"
                  className="product-detail-gallery-button"
                  onClick={() => setSelectedPreviewImage(image)}
                >
                  <img src={image} alt={`${selectedProductDetail.name} ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="product-detail-section">
              <h4>{selectedProductDetail.name}</h4>
              <p>{selectedProductDetail.description}</p>
            </div>

            <div className="product-detail-summary-card">
              <div className="detail-price-row">
                <span className="detail-current-price">
                  {(selectedProductDetail.currentPrice ?? selectedProductDetail.price ?? 0).toLocaleString()}원
                </span>
                <span className="detail-original-price">
                  {(selectedProductDetail.originalPrice ?? 0).toLocaleString()}원
                </span>
              </div>

              <div className="detail-price-meta">
                <span>하락률 {selectedProductDetail.discountRate ?? 0}%</span>
                <span>시작가 {(selectedProductDetail.startPrice ?? 0).toLocaleString()}원</span>
                <span>하락폭 {(selectedProductDetail.dropAmount ?? 0).toLocaleString()}원</span>
              </div>

              <div className="detail-basic-info">
                <div className="detail-basic-info-item">
                  <span className="detail-label">카테고리</span>
                  <strong>{selectedProductDetail.category}</strong>
                </div>

                <div className="detail-basic-info-item">
                  <span className="detail-label">수량</span>
                  <strong>{selectedProductDetail.quantity}개</strong>
                </div>
              </div>
            </div>

            <div className="product-detail-section">
              <h5>가격 변동 이력</h5>
              <div className="detail-trend-chart-box">
                <TrendChart data={selectedProductDetail.trend} />
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

              <div className="store-map-box">
                <div className="store-map-title">매장 위치</div>
                <div className="mini-map">📍 {selectedProductDetail.store} 지도 영역</div>
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
              <button className="icon-close" onClick={() => setMyPageOrderDetail(null)}>✕</button>
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
                <p className="pickup-complete-time">픽업 완료 일시 : {myPageOrderDetail.pickedUpAt}</p>
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