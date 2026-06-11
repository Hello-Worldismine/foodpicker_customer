import { Home, Map, Heart, ClipboardList, User } from 'lucide-react';
import { colors } from '../theme';

const tabs = [
  { key: 'home', label: '홈', Icon: Home },
  { key: 'map', label: '지도', Icon: Map },
  { key: 'liked', label: '찜', Icon: Heart },
  { key: 'orders', label: '주문내역', Icon: ClipboardList },
  { key: 'mypage', label: '마이', Icon: User },
];

export default function BottomNav({ current, onChange }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: colors.white,
      borderTop: `1px solid ${colors.softGray}`,
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ key, label, Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? colors.primaryGreen : colors.mediumGray,
              gap: 3,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
