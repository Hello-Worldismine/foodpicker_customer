import { useState } from 'react';
import { Navigation, QrCode, X, Clock, Star } from 'lucide-react';
import { colors } from '../theme';
import PickupMapCard from '../components/PickupMapCard';

const STATUS_LABELS = {
  pending: { label: '픽업 대기', color: colors.primaryGreen, bg: colors.freshMint },
  completed: { label: '픽업 완료', color: colors.mediumGray, bg: colors.softGray },
  cancelled: { label: '취소됨', color: colors.alertRed, bg: '#FFF0F0' },
};

export default function OrderHistoryScreen({ orders, onCancelOrder }) {
  const [tab, setTab] = useState('pending');
  const [showQR, setShowQR] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  const filtered = orders.filter(o => {
    if (tab === 'pending') return o.status === 'pending';
    if (tab === 'completed') return o.status === 'completed';
    if (tab === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: colors.white, padding: '16px 16px 0', position: 'sticky', top: 0, zIndex: 10 }}>
        <p style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 900, color: colors.charcoalBlack }}>주문내역</p>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${colors.softGray}` }}>
          {[
            { key: 'pending', label: '예약중' },
            { key: 'completed', label: '픽업완료' },
            { key: 'cancelled', label: '취소·환불' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: `2.5px solid ${tab === t.key ? colors.primaryGreen : 'transparent'}`,
              fontSize: 14,
              fontWeight: tab === t.key ? 800 : 400,
              color: tab === t.key ? colors.primaryGreen : colors.mediumGray,
              cursor: 'pointer',
              marginBottom: -2,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px 100px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>주문 내역이 없습니다</p>
          </div>
        ) : (
          filtered.map(order => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <div key={order.id} style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
                {/* Status badge */}
                <div style={{
                  display: 'inline-block',
                  background: st.bg,
                  color: st.color,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 8,
                  marginBottom: 10,
                }}>
                  {st.label}
                </div>

                <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 800, color: colors.charcoalBlack }}>
                  {order.productName}
                </p>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: colors.mediumGray }}>
                  {order.store}
                </p>

                <div style={{ background: colors.softGray, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: colors.mediumGray }}>픽업 시간</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors.charcoalBlack, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} color={colors.warmOrange} /> {order.pickupTime}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: colors.mediumGray }}>픽업번호</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: colors.primaryGreen }}>{order.id}</span>
                  </div>
                </div>

                {/* 예약중: 픽업 장소 + 지도 */}
                {order.status === 'pending' && order.storeAddress && (
                  <div style={{ marginBottom: 12 }}>
                    <PickupMapCard
                      address={order.storeAddress}
                      storeName={order.store}
                      compact
                    />
                  </div>
                )}

                {order.status === 'completed' && (
                  <button style={{
                    width: '100%',
                    background: colors.freshMint,
                    color: colors.primaryGreen,
                    border: `1.5px solid ${colors.primaryGreen}`,
                    borderRadius: 10,
                    padding: '10px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}>
                    <Star size={14} color={colors.primaryGreen} fill={colors.primaryGreen} />
                    리뷰 쓰기
                  </button>
                )}

                {order.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowQR(order)} style={{
                      flex: 1,
                      background: colors.freshMint,
                      color: colors.primaryGreen,
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                    }}>
                      <QrCode size={14} /> QR 보기
                    </button>
                    <button onClick={() => setShowCancelConfirm(order)} style={{
                      flex: 1,
                      background: '#FFF0F0',
                      color: colors.alertRed,
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}>
                      취소 요청
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 24,
        }} onClick={() => setShowQR(null)}>
          <div style={{
            background: colors.white, borderRadius: 24, padding: 28,
            width: '100%', maxWidth: 320, textAlign: 'center',
          }} onClick={e => e.stopPropagation()}>
            <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: colors.charcoalBlack }}>픽업 QR코드</p>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: colors.mediumGray }}>{showQR.store}</p>
            <div style={{
              background: colors.softGray, borderRadius: 16, padding: 24,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 16,
            }}>
              <QrCode size={120} color={colors.charcoalBlack} />
              <span style={{ fontSize: 28, fontWeight: 900, color: colors.primaryGreen, letterSpacing: 3 }}>
                {showQR.id}
              </span>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: colors.mediumGray }}>픽업 시간: {showQR.pickupTime}</p>
            <button onClick={() => setShowQR(null)} style={{
              width: '100%', background: colors.primaryGreen, color: colors.white,
              border: 'none', borderRadius: 12, padding: '13px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>닫기</button>
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 200,
        }} onClick={() => setShowCancelConfirm(null)}>
          <div style={{
            background: colors.white, borderRadius: '24px 24px 0 0', padding: '24px 16px 40px',
            width: '100%', maxWidth: 430,
          }} onClick={e => e.stopPropagation()}>
            <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: colors.charcoalBlack }}>주문을 취소할까요?</p>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: colors.mediumGray }}>
              취소된 주문은 복구할 수 없습니다.<br />
              식품 특성상 픽업 후 취소는 불가합니다.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCancelConfirm(null)} style={{
                flex: 1, background: colors.softGray, color: colors.charcoalBlack,
                border: 'none', borderRadius: 12, padding: '14px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}>돌아가기</button>
              <button onClick={() => {
                onCancelOrder(showCancelConfirm.id);
                setShowCancelConfirm(null);
              }} style={{
                flex: 1, background: colors.alertRed, color: colors.white,
                border: 'none', borderRadius: 12, padding: '14px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}>취소하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
