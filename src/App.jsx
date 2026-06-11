import { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import SearchScreen from './screens/SearchScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import MyPageScreen from './screens/MyPageScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import OrderScreen from './screens/OrderScreen';
import OrderCompleteScreen from './screens/OrderCompleteScreen';
import StoreScreen from './screens/StoreScreen';
import LikedScreen from './screens/LikedScreen';
import TermsScreen from './screens/TermsScreen';
import { products as initialProducts, mockOrders } from './mockData';

function App() {
  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState(null);
  const [productList, setProductList] = useState(initialProducts);
  const [orders, setOrders] = useState(mockOrders);

  function handleProductPress(product) {
    setScreen({ name: 'detail', data: { product } });
  }

  function handleStorePress(storeId) {
    setScreen({ name: 'store', data: { storeId } });
  }

  function handleTermsPress() {
    setScreen({ name: 'terms' });
  }

  function handleLike(productId) {
    setProductList(prev => prev.map(p =>
      p.id === productId ? { ...p, liked: !p.liked } : p
    ));
  }

  function handleOrder(product, qty) {
    setScreen({ name: 'order', data: { product, qty } });
  }

  function handleOrderComplete(order) {
    setOrders(prev => [order, ...prev]);
    setScreen({ name: 'complete', data: { order } });
  }

  function handleCancelOrder(orderId) {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    );
  }

  function handleViewOrders() {
    setScreen(null);
    setTab('orders');
  }

  function getProduct(id) {
    return productList.find(p => p.id === id);
  }

  // ─── 스택 화면들 ───────────────────────────────────────

  if (screen?.name === 'terms') {
    return (
      <AppShell>
        <ScrollableScreen key="terms">
          <TermsScreen onBack={() => setScreen(null)} />
        </ScrollableScreen>
      </AppShell>
    );
  }

  if (screen?.name === 'complete') {
    return (
      <AppShell>
        <ScrollableScreen key="complete">
          <OrderCompleteScreen
            order={screen.data.order}
            onViewOrders={handleViewOrders}
            onHome={() => { setScreen(null); setTab('home'); }}
          />
        </ScrollableScreen>
      </AppShell>
    );
  }

  if (screen?.name === 'order') {
    const product = getProduct(screen.data.product.id) || screen.data.product;
    return (
      <AppShell>
        <ScrollableScreen key={`order-${product.id}`}>
          <OrderScreen
            product={product}
            qty={screen.data.qty}
            onBack={() => setScreen({ name: 'detail', data: { product } })}
            onComplete={handleOrderComplete}
          />
        </ScrollableScreen>
      </AppShell>
    );
  }

  if (screen?.name === 'detail') {
    const product = getProduct(screen.data.product.id) || screen.data.product;
    return (
      <AppShell>
        <ScrollableScreen key={`detail-${product.id}`}>
          <ProductDetailScreen
            product={product}
            onBack={() => setScreen(null)}
            onOrder={handleOrder}
            onLike={handleLike}
            onStorePress={handleStorePress}
          />
        </ScrollableScreen>
      </AppShell>
    );
  }

  if (screen?.name === 'store') {
    return (
      <AppShell>
        <ScrollableScreen key={`store-${screen.data.storeId}`}>
          <StoreScreen
            storeId={screen.data.storeId}
            onBack={() => setScreen(null)}
            onProductPress={handleProductPress}
            onLike={handleLike}
            productList={productList}
          />
        </ScrollableScreen>
      </AppShell>
    );
  }

  // ─── 탭 화면들 ─────────────────────────────────────────

  return (
    <AppShell>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', minHeight: 0 }}>
        {tab === 'home' && (
          <HomeScreen
            onProductPress={handleProductPress}
            onStorePress={handleStorePress}
            onLike={handleLike}
            productList={productList}
          />
        )}
        {tab === 'map' && (
          <MapScreen
            onProductPress={handleProductPress}
            onStorePress={handleStorePress}
          />
        )}
        {tab === 'liked' && (
          <LikedScreen
            productList={productList}
            onProductPress={handleProductPress}
            onStorePress={handleStorePress}
            onLike={handleLike}
          />
        )}
        {tab === 'orders' && (
          <OrderHistoryScreen orders={orders} onCancelOrder={handleCancelOrder} />
        )}
        {tab === 'mypage' && (
          <MyPageScreen onTermsPress={handleTermsPress} orders={orders} onOrdersPress={handleViewOrders} />
        )}
      </div>
      <BottomNav current={tab} onChange={setTab} />
    </AppShell>
  );
}

function AppShell({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: 430,
      margin: '0 auto',
      height: '100dvh',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(0,0,0,0.1)',
    }}>
      {children}
    </div>
  );
}

// 스택 화면용 스크롤 컨테이너
function ScrollableScreen({ children }) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: 0,
      position: 'relative',
    }}>
      {children}
    </div>
  );
}

export default App;
