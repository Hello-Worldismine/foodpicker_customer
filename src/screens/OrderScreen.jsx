import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Check } from 'lucide-react';
import { colors } from '../theme';
import PickupMapCard from '../components/PickupMapCard';

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

const PAYMENT_METHODS = [
  { id: 'card', label: '신용/체크카드', Icon: CreditCard },
  { id: 'kakaopay', label: '카카오페이', Icon: Smartphone },
  { id: 'naverpay', label: '네이버페이', Icon: Smartphone },
  { id: 'tosspay', label: '토스페이', Icon: Smartphone },
];

const CONFIRMS = [
  '소비기한 임박 상품임을 확인했습니다.',
  '지정된 픽업 시간 내 방문해야 함을 확인했습니다.',
  '픽업 후 단순 변심 환불이 제한될 수 있음을 확인했습니다.',
];

export default function OrderScreen({ product, qty, onBack, onComplete }) {
  const [payMethod, setPayMethod] = useState('card');
  const [checked, setChecked] = useState([false, false, false]);

  const allChecked = checked.every(Boolean);
  const total = product.salePrice * qty;

  function toggleCheck(i) {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  function handlePay() {
    if (!allChecked) return;
    onComplete({
      id: `FP-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: product.name,
      store: product.store,
      storeAddress: product.pickupAddress,
      pickupTime: `오늘 ${formatTime(product.pickupStart)}~${formatTime(product.pickupEnd)}`,
      quantity: qty,
      totalPrice: total,
      status: 'pending',
      orderedAt: new Date().toISOString(),
    });
  }

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: colors.white, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${colors.softGray}` }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} color={colors.charcoalBlack} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>주문/결제</span>
      </div>

      <div style={{ padding: '12px 16px 140px' }}>
        {/* Product summary */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>주문 상품</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, background: colors.softGray, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {product.images[0]}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.charcoalBlack }}>{product.name}</p>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: colors.mediumGray }}>{product.store}</p>
              <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 700, color: colors.primaryGreen }}>
                {product.salePrice.toLocaleString()}원 × {qty}개
              </p>
            </div>
          </div>
        </div>

        {/* Pickup info */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>픽업 정보</p>
          {[
            { label: '픽업 매장', value: product.store },
            { label: '픽업 가능 시간', value: `${formatTime(product.pickupStart)} ~ ${formatTime(product.pickupEnd)}` },
            { label: '소비기한', value: formatDate(product.expiryDate) },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: `1px solid ${colors.softGray}` }}>
              <span style={{ fontSize: 13, color: colors.mediumGray, flexShrink: 0, marginRight: 8 }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.charcoalBlack, textAlign: 'right' }}>{item.value}</span>
            </div>
          ))}
          {/* 픽업 장소 + 지도 */}
          <div style={{ marginTop: 14 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: colors.mediumGray }}>픽업 장소</p>
            <PickupMapCard
              address={product.pickupAddress}
              storeName={product.store}
              compact
            />
          </div>
        </div>

        {/* Payment method */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>결제 수단</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PAYMENT_METHODS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setPayMethod(id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px',
                background: payMethod === id ? colors.freshMint : colors.softGray,
                border: `1.5px solid ${payMethod === id ? colors.primaryGreen : 'transparent'}`,
                borderRadius: 12, cursor: 'pointer',
              }}>
                <Icon size={16} color={payMethod === id ? colors.primaryGreen : colors.mediumGray} />
                <span style={{ fontSize: 13, fontWeight: payMethod === id ? 700 : 400, color: payMethod === id ? colors.primaryGreen : colors.charcoalBlack }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>결제 금액</p>
          {[
            { label: '상품 금액', value: `${(product.originalPrice * qty).toLocaleString()}원` },
            { label: '할인 금액', value: `-${((product.originalPrice - product.salePrice) * qty).toLocaleString()}원`, color: colors.primaryGreen },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span style={{ fontSize: 13, color: colors.mediumGray }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: item.color || colors.charcoalBlack }}>{item.value}</span>
            </div>
          ))}
          <div style={{ borderTop: `2px solid ${colors.softGray}`, marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: colors.charcoalBlack }}>최종 결제</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: colors.primaryGreen }}>{total.toLocaleString()}원</span>
          </div>
        </div>

        {/* Confirm checkboxes */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>구매 전 필수 확인</p>
          {CONFIRMS.map((text, i) => (
            <label key={i} onClick={() => toggleCheck(i)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 0',
              borderBottom: i < 2 ? `1px solid ${colors.softGray}` : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: checked[i] ? colors.primaryGreen : colors.softGray,
                border: `2px solid ${checked[i] ? colors.primaryGreen : '#D0D3D7'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {checked[i] && <Check size={13} color={colors.white} strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 13, color: colors.charcoalBlack, lineHeight: 1.5 }}>{text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom button */}
      <div style={{
        position: 'fixed', bottom: 56, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: colors.white, borderTop: `1px solid ${colors.softGray}`,
        padding: '12px 16px', zIndex: 90,
      }}>
        <button
          disabled={!allChecked}
          onClick={handlePay}
          style={{
            width: '100%',
            background: allChecked ? colors.primaryGreen : colors.mediumGray,
            color: colors.white,
            border: 'none',
            borderRadius: 14,
            padding: '16px',
            fontSize: 17,
            fontWeight: 800,
            cursor: allChecked ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {allChecked ? `${total.toLocaleString()}원 결제하기` : '위 내용을 모두 확인해주세요'}
        </button>
      </div>
    </div>
  );
}
