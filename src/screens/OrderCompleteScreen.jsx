import { CheckCircle, MapPin, Navigation, ClipboardList, QrCode } from 'lucide-react';
import { colors } from '../theme';

export default function OrderCompleteScreen({ order, onViewOrders, onHome }) {
  return (
    <div style={{ background: colors.softGray, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Success header */}
      <div style={{
        background: `linear-gradient(135deg, #1A8F5A, ${colors.primaryGreen})`,
        padding: '48px 16px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        color: colors.white,
      }}>
        <CheckCircle size={56} color={colors.white} strokeWidth={1.5} />
        <p style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>예약이 완료되었어요!</p>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>픽업 시간에 맞춰 방문해주세요</p>
      </div>

      <div style={{ padding: '16px 16px 120px', flex: 1 }}>
        {/* Pickup number */}
        <div style={{
          background: colors.white,
          borderRadius: 20,
          padding: '20px',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: colors.mediumGray }}>픽업번호</p>
          <p style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 900, color: colors.primaryGreen, letterSpacing: 2 }}>
            {order.id}
          </p>
          <div style={{
            background: colors.softGray,
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8,
          }}>
            <QrCode size={80} color={colors.charcoalBlack} />
          </div>
          <p style={{ margin: 0, fontSize: 13, color: colors.mediumGray }}>매장 직원에게 픽업번호를 보여주세요.</p>
        </div>

        {/* Order details */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>예약 정보</p>
          {[
            { label: '상품명', value: order.productName },
            { label: '픽업 시간', value: order.pickupTime },
            { label: '픽업 매장', value: order.store },
            { label: '매장 주소', value: order.storeAddress },
            { label: '결제 금액', value: `${order.totalPrice.toLocaleString()}원`, bold: true },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '8px 0', borderBottom: `1px solid ${colors.softGray}`,
            }}>
              <span style={{ fontSize: 13, color: colors.mediumGray, flexShrink: 0, marginRight: 8 }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: item.bold ? 800 : 600, color: item.bold ? colors.primaryGreen : colors.charcoalBlack, textAlign: 'right' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Pickup reminder */}
        <div style={{ background: colors.freshMint, borderRadius: 16, padding: '14px 16px', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: colors.primaryGreen, fontWeight: 600 }}>
            📍 픽업 30분 전에 알림을 보내드릴게요
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1,
            background: colors.white,
            color: colors.primaryGreen,
            border: `2px solid ${colors.primaryGreen}`,
            borderRadius: 14,
            padding: '14px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            <Navigation size={16} /> 길찾기
          </button>
          <button
            onClick={onViewOrders}
            style={{
              flex: 1,
              background: colors.primaryGreen,
              color: colors.white,
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <ClipboardList size={16} /> 주문내역 보기
          </button>
        </div>
      </div>
    </div>
  );
}
