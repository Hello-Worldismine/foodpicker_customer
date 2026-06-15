import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { colors } from '../theme';

const STATUS_INFO = {
  pending:   { label: '픽업 대기', color: colors.primaryGreen, bg: colors.freshMint,  Icon: Clock },
  completed: { label: '픽업 완료', color: '#6B7280',           bg: '#F3F4F6',         Icon: CheckCircle },
  cancelled: { label: '취소됨',    color: colors.alertRed,      bg: '#FFF0F0',         Icon: XCircle },
};

const PAGE_SIZE = 10;

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffMin < 60 * 24) return `${Math.floor(diffMin / 60)}시간 전`;
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function OrderCard({ order }) {
  const st = STATUS_INFO[order.status] || STATUS_INFO.pending;
  const Icon = st.Icon;

  return (
    <div style={{
      background: colors.white,
      borderRadius: 16,
      padding: '14px 16px',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* 상태 아이콘 */}
      <div style={{
        width: 44, height: 44, borderRadius: 13, flexShrink: 0,
        background: st.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={st.color} />
      </div>

      {/* 주문 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: st.color, background: st.bg,
            padding: '2px 7px', borderRadius: 6, flexShrink: 0,
          }}>{st.label}</span>
          <span style={{ fontSize: 11, color: colors.mediumGray, flexShrink: 0 }}>
            {formatDate(order.orderedAt)}
          </span>
        </div>
        <p style={{
          margin: 0, fontSize: 15, fontWeight: 700, color: colors.charcoalBlack,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {order.productName}
        </p>
        <p style={{
          margin: '2px 0 0', fontSize: 12, color: colors.mediumGray,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {order.store}
        </p>
      </div>

      {/* 금액 + 화살표 */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: colors.charcoalBlack }}>
          {order.totalPrice.toLocaleString()}원
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: colors.mediumGray }}>
          {order.id}
        </p>
      </div>
    </div>
  );
}

export default function MyOrderListScreen({ orders = [], onBack }) {
  const sorted = [...orders].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const hasMore = visibleCount < sorted.length;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, sorted.length));
      setLoading(false);
    }, 500);
  }, [loading, hasMore, sorted.length]);

  // IntersectionObserver로 스크롤 끝 감지
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = sorted.slice(0, visibleCount);

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* 헤더 */}
      <div style={{
        background: colors.white,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: `1px solid ${colors.softGray}`,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
        }}>
          <ArrowLeft size={22} color={colors.charcoalBlack} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>주문내역</span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: colors.mediumGray }}>
          총 {sorted.length}건
        </span>
      </div>

      <div style={{ padding: '12px 16px 40px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
            <p style={{ fontSize: 15, color: colors.mediumGray, margin: 0 }}>
              아직 주문 내역이 없습니다
            </p>
          </div>
        ) : (
          <>
            {visible.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}

            {/* 로딩 스피너 / 끝 표시 */}
            <div ref={loaderRef} style={{ textAlign: 'center', padding: '16px 0' }}>
              {loading ? (
                <div style={{
                  display: 'inline-block',
                  width: 22, height: 22,
                  border: `2.5px solid ${colors.softGray}`,
                  borderTopColor: colors.primaryGreen,
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : !hasMore && sorted.length > 0 ? (
                <p style={{ fontSize: 12, color: colors.mediumGray, margin: 0 }}>
                  모든 주문내역을 불러왔습니다
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
