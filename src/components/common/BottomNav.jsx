const navItems = [
    { key: 'home', label: '홈', icon: '🏠' },
    { key: 'map', label: '지도', icon: '🗺️' },
    { key: 'favorites', label: '관심', icon: '💙' },
    { key: 'orders', label: '주문', icon: '📦' },
    { key: 'mypage', label: '마이페이지', icon: '👤' },
  ]
  
  function BottomNav({ activeTab, onChange }) {
    return (
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    )
  }
  
  export default BottomNav