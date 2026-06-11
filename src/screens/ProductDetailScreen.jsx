import { useState } from 'react';
import { ArrowLeft, Heart, Share2, Clock, MapPin, Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { colors } from '../theme';
import PickupMapCard from '../components/PickupMapCard';

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function ProductDetailScreen({ product, onBack, onOrder, onLike, onStorePress }) {
  const [qty, setQty] = useState(1);
  const [expandedSection, setExpandedSection] = useState(null);

  const now = new Date();
  const isExpired = new Date(product.expiryDate) < now;
  const isPickupEnded = new Date(product.pickupEnd) < now;
  const isSoldout = product.status === 'soldout' || product.stock === 0;
  const unavailable = isExpired || isPickupEnded || isSoldout;

  let btnLabel = `${(product.salePrice * qty).toLocaleString()}원 예약하기`;
  let btnDisabled = false;
  if (isSoldout) { btnLabel = '품절된 상품입니다'; btnDisabled = true; }
  if (isPickupEnded || isExpired) { btnLabel = '판매가 종료되었습니다'; btnDisabled = true; }

  const sections = [
    { key: 'composition', label: '상품 구성', content: product.composition },
    { key: 'origin', label: '원산지 정보', content: product.origin },
    { key: 'allergy', label: '알레르기 정보', content: product.allergyInfo },
    { key: 'storage', label: '보관 방법', content: product.storageMethod },
    { key: 'expiry', label: '소비기한', content: formatDate(product.expiryDate) },
    { key: 'pickupTime', label: '픽업 가능 시간', content: `${formatTime(product.pickupStart)} ~ ${formatTime(product.pickupEnd)}` },
    { key: 'cancel', label: '취소/환불 규정', content: product.cancelPolicy },
    ...(product.storeNotice ? [{ key: 'notice', label: '매장 공지', content: product.storeNotice }] : []),
  ];

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* Image area */}
      <div style={{ position: 'relative', background: '#E8F0E8', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>
        {product.images[0]}
        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: 14 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} color={colors.charcoalBlack} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} color={colors.charcoalBlack} />
            </button>
            <button onClick={() => onLike(product.id)} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Heart size={18} fill={product.liked ? colors.alertRed : 'none'} color={product.liked ? colors.alertRed : colors.charcoalBlack} />
            </button>
          </div>
        </div>
        {/* Badges */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
          {product.badges.map(b => (
            <span key={b} style={{
              background: b === '마감임박' || b === '오늘까지' ? colors.warmOrange : colors.primaryGreen,
              color: colors.white,
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 9px',
              borderRadius: 8,
            }}>{b}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0 140px' }}>
        {/* Basic info card */}
        <div style={{ background: colors.white, padding: '20px 16px', marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.charcoalBlack }}>{product.name}</p>
          <button
            onClick={() => onStorePress && onStorePress(product.storeId)}
            style={{
              background: 'none', border: 'none', padding: '0 0 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <MapPin size={13} color={colors.primaryGreen} />
            <span style={{ fontSize: 14, color: colors.primaryGreen, fontWeight: 600 }}>{product.store}</span>
            <ChevronDown size={13} color={colors.primaryGreen} style={{ transform: 'rotate(-90deg)' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: colors.mediumGray, textDecoration: 'line-through' }}>
              정가 {product.originalPrice.toLocaleString()}원
            </span>
            <span style={{ background: colors.alertRed, color: colors.white, fontSize: 13, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>
              {product.discountRate}%
            </span>
          </div>
          <p style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 900, color: colors.primaryGreen }}>
            {product.salePrice.toLocaleString()}원
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: '남은 수량', value: isSoldout ? '품절' : `${product.stock}개`, warn: isSoldout },
              { label: '픽업 가능 시간', value: `${formatTime(product.pickupStart)}~${formatTime(product.pickupEnd)}` },
              { label: '소비기한', value: formatDate(product.expiryDate), warn: isExpired },
              { label: '보관 방법', value: product.storage },
            ].map(item => (
              <div key={item.label} style={{ background: colors.softGray, borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ margin: 0, fontSize: 11, color: colors.mediumGray }}>{item.label}</p>
                <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 700, color: item.warn ? colors.alertRed : colors.charcoalBlack }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice box */}
        <div style={{ background: '#FFF8E6', margin: '0 0 8px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color={colors.warmOrange} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.warmOrange }}>구매 전 꼭 확인해주세요</span>
          </div>
          {[
            '이 상품은 소비기한이 임박한 상품입니다.',
            '구매 후 지정된 시간 안에 매장에서 직접 픽업해야 합니다.',
            '픽업 후에는 식품 특성상 단순 변심 환불이 어려울 수 있습니다.',
            '알레르기 정보와 보관 방법을 확인해주세요.',
          ].map((t, i) => (
            <p key={i} style={{ margin: '4px 0 0', fontSize: 13, color: '#7A5C1E' }}>• {t}</p>
          ))}
        </div>

        {/* 픽업 장소 + 지도 */}
        <div style={{ margin: '0 0 8px', padding: '0 0 0' }}>
          <div style={{ padding: '16px 16px 0', background: colors.white }}>
            <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>픽업 장소</p>
          </div>
          <div style={{ padding: '0 16px 0', background: colors.white }}>
            <PickupMapCard
              address={product.pickupAddress}
              storeName={product.store}
            />
          </div>
          <div style={{ height: 8, background: colors.softGray }} />
        </div>

        {/* Detail sections */}
        <div style={{ background: colors.white }}>
          {sections.map((sec, idx) => (
            <div key={sec.key} style={{ borderTop: idx === 0 ? 'none' : `1px solid ${colors.softGray}` }}>
              <button
                onClick={() => setExpandedSection(expandedSection === sec.key ? null : sec.key)}
                style={{
                  width: '100%', padding: '14px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.charcoalBlack }}>{sec.label}</span>
                {expandedSection === sec.key
                  ? <ChevronUp size={16} color={colors.mediumGray} />
                  : <ChevronDown size={16} color={colors.mediumGray} />}
              </button>
              {expandedSection === sec.key && (
                <div style={{ padding: '0 16px 14px' }}>
                  <p style={{ margin: 0, fontSize: 13, color: colors.charcoalBlack, lineHeight: 1.6 }}>{sec.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom purchase bar */}
      <div style={{
        position: 'fixed',
        bottom: 56,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: colors.white,
        borderTop: `1px solid ${colors.softGray}`,
        padding: '12px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        zIndex: 90,
      }}>
        {!btnDisabled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1.5px solid #E8EAED`, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{ width: 40, height: 48, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: colors.charcoalBlack }}
            >−</button>
            <span style={{ width: 32, textAlign: 'center', fontSize: 16, fontWeight: 700, color: colors.charcoalBlack }}>{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(product.stock, q + 1))}
              style={{ width: 40, height: 48, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: colors.charcoalBlack }}
            >+</button>
          </div>
        )}
        <button
          disabled={btnDisabled}
          onClick={() => onOrder(product, qty)}
          style={{
            flex: 1,
            background: btnDisabled ? colors.mediumGray : colors.primaryGreen,
            color: colors.white,
            border: 'none',
            borderRadius: 14,
            padding: '14px',
            fontSize: 16,
            fontWeight: 800,
            cursor: btnDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}
