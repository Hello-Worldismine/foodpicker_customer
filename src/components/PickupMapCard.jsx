import { MapPin, Navigation } from 'lucide-react';
import { colors } from '../theme';

// 지도 플레이스홀더 (추후 실제 지도로 교체)
function MapPlaceholder() {
  return (
    <div style={{
      height: 150,
      background: '#ECF0F5',
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* 도로 시뮬레이션 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* 가로 도로 */}
        <div style={{ position: 'absolute', top: '42%', left: 0, right: 0, height: 12, background: '#D6DCE6' }} />
        <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, height: 7, background: '#DDE2EB' }} />
        {/* 세로 도로 */}
        <div style={{ position: 'absolute', left: '28%', top: 0, bottom: 0, width: 10, background: '#D6DCE6' }} />
        <div style={{ position: 'absolute', left: '62%', top: 0, bottom: 0, width: 7, background: '#DDE2EB' }} />
        {/* 블록 */}
        <div style={{ position: 'absolute', top: 8, left: 8, width: '22%', height: '34%', background: '#E2E7EF', borderRadius: 6 }} />
        <div style={{ position: 'absolute', top: 8, left: '32%', width: '26%', height: '34%', background: '#E2E7EF', borderRadius: 6 }} />
        <div style={{ position: 'absolute', top: 8, left: '66%', right: 8, height: '34%', background: '#E2E7EF', borderRadius: 6 }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, width: '18%', top: '76%', background: '#E2E7EF', borderRadius: 6 }} />
        <div style={{ position: 'absolute', bottom: 8, left: '32%', right: 8, top: '76%', background: '#E2E7EF', borderRadius: 6 }} />
      </div>

      {/* 핀 */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 42, height: 42,
          background: colors.primaryGreen,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          boxShadow: '0 3px 10px rgba(34,160,107,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPin size={18} color="white" style={{ transform: 'rotate(45deg)' }} />
        </div>
        <span style={{
          fontSize: 11,
          color: '#555',
          fontWeight: 600,
          background: 'rgba(255,255,255,0.92)',
          padding: '3px 10px',
          borderRadius: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}>
          지도 준비 중
        </span>
      </div>
    </div>
  );
}

export default function PickupMapCard({ address, storeName, compact = false, standalone = false }) {
  return (
    <div style={standalone ? { background: colors.white, borderRadius: 16, overflow: 'hidden' } : {}}>
      {/* 주소 헤더 */}
      <div style={{ padding: compact ? '0 0 12px' : '0 0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1 }}>
            {storeName && (
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: colors.charcoalBlack }}>{storeName}</p>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <MapPin size={14} color={colors.primaryGreen} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 13, color: colors.mediumGray, lineHeight: 1.5 }}>{address}</p>
            </div>
          </div>
          {/* 길찾기 버튼 */}
          <button style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 4,
            background: colors.freshMint,
            border: 'none',
            borderRadius: 20,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 700,
            color: colors.primaryGreen,
            cursor: 'pointer',
          }}>
            <Navigation size={12} />
            길찾기
          </button>
        </div>
      </div>

      {/* 지도 영역 */}
      <div style={{ paddingBottom: compact ? 0 : 4 }}>
        <MapPlaceholder />
      </div>
    </div>
  );
}
