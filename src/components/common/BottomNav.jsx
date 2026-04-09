import { House, MapPinned, Heart, UserRound } from 'lucide-react'

const navItems = [
  { key: 'home', label: '홈', icon: House },
  { key: 'map', label: '지도', icon: MapPinned },
  { key: 'favorites', label: '찜', icon: Heart },
  { key: 'mypage', label: '마이페이지', icon: UserRound },
]

function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <button
            key={item.key}
            className={`bottom-nav-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
            type="button"
          >
            <Icon className="bottom-nav-icon" strokeWidth={2} />
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav