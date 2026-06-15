import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Check, Tag, ChevronRight, X } from 'lucide-react';
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

// 관리자 앱 주문번호 형식과 동일하게 맞춤: ORD-YYYYMMDD-XXX
function generateOrderId() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const seq = String(Math.floor(100 + Math.random() * 900));
  return `ORD-${date}-${seq}`;
}

const PAYMENT_METHODS = [
  { id: 'card',     label: '신용/체크카드', Icon: CreditCard },
  { id: 'kakaopay', label: '카카오페이',   Icon: Smartphone },
  { id: 'naverpay', label: '네이버페이',   Icon: Smartphone },
  { id: 'tosspay',  label: '토스페이',     Icon: Smartphone },
];

const CONFIRMS = [
  '소비기한 임박 상품임을 확인했습니다.',
  '지정된 픽업 시간 내 방문해야 함을 확인했습니다.',
  '픽업 후 단순 변심 환불이 제한될 수 있음을 확인했습니다.',
];

function calcCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (coupon.discountType === '정액') return Math.min(coupon.discountValue, subtotal);
  return Math.floor(subtotal * coupon.discountValue / 100);
}

export default function OrderScreen({ product, qty, coupons = [], onBack, onComplete }) {
  const [payMethod, setPayMethod] = useState('card');
  const [checked, setChecked] = useState([false, false, false]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponSheet, setShowCouponSheet] = useState(false);

  const allChecked = checked.every(Boolean);
  const subtotal = product.salePrice * qty;
  const couponDiscount = calcCouponDiscount(selectedCoupon, subtotal);
  const finalPrice = subtotal - couponDiscount;

  // 최소 주문금액 충족 쿠폰만 노출
  const availableCoupons = coupons.filter(c => subtotal >= c.minOrderAmount);

  function toggleCheck(i) {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  function handlePay() {
    if (!allChecked) return;
    onComplete({
      id: generateOrderId(),
      productName: product.name,
      store: product.store,
      storeAddress: product.pickupAddress,
      pickupTime: `오늘 ${formatTime(product.pickupStart)}~${formatTime(product.pickupEnd)}`,
      quantity: qty,
      totalPrice: subtotal,
      discountedPrice: finalPrice,
      couponName: selectedCoupon?.name || null,
      status: 'pickupReady',   // 결제완료 → 픽업대기 (관리자 앱 상태와 동기화)
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

      <div style={{ padding: '12px 16px 160px' }}>

        {/* 주문 상품 */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>주문 상품</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, background: colors.softGray, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, overflow: 'hidden', flexShrink: 0,
            }}>
              {product.thumbnail
                ? <img src={product.thumbnail} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span>{product.emoji || '🍱'}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.charcoalBlack }}>{product.name}</p>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: colors.mediumGray }}>{product.store}</p>
              <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 700, color: colors.primaryGreen }}>
                {product.salePrice.toLocaleString()}원 × {qty}개
              </p>
            </div>
          </div>
        </div>

        {/* 픽업 정보 */}
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
          <div style={{ marginTop: 14 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: colors.mediumGray }}>픽업 장소</p>
            <PickupMapCard address={product.pickupAddress} storeName={product.store} compact />
          </div>
        </div>

        {/* 쿠폰 */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: selectedCoupon ? 10 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag size={16} color={colors.primaryGreen} />
              <span style={{ fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>쿠폰</span>
              {availableCoupons.length > 0 && !selectedCoupon && (
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.primaryGreen, background: colors.freshMint, padding: '2px 7px', borderRadius: 20 }}>
                  {availableCoupons.length}장 사용 가능
                </span>
              )}
            </div>
            {!selectedCoupon ? (
              availableCoupons.length > 0 ? (
                <button onClick={() => setShowCouponSheet(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}>
                  <span style={{ fontSize: 13, color: colors.primaryGreen, fontWeight: 700 }}>쿠폰 선택</span>
                  <ChevronRight size={15} color={colors.primaryGreen} />
                </button>
              ) : (
                <span style={{ fontSize: 13, color: colors.mediumGray }}>사용 가능한 쿠폰 없음</span>
              )
            ) : (
              <button onClick={() => setSelectedCoupon(null)} style={{
                display: 'flex', alignItems: 'center', gap: 3,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                <span style={{ fontSize: 13, color: colors.alertRed, fontWeight: 600 }}>해제</span>
                <X size={14} color={colors.alertRed} />
              </button>
            )}
          </div>

          {selectedCoupon && (
            <div style={{ background: colors.freshMint, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.primaryGreen }}>{selectedCoupon.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: colors.primaryGreen }}>
                  {selectedCoupon.discountType === '정액'
                    ? `-${selectedCoupon.discountValue.toLocaleString()}원`
                    : `-${selectedCoupon.discountValue}%`} 할인
                </p>
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: colors.primaryGreen }}>
                -{couponDiscount.toLocaleString()}원
              </span>
            </div>
          )}
        </div>

        {/* 결제 수단 */}
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

        {/* 결제 금액 */}
        <div style={{ background: colors.white, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: colors.mediumGray }}>결제 금액</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span style={{ fontSize: 13, color: colors.mediumGray }}>상품 금액</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.charcoalBlack }}>{(product.originalPrice * qty).toLocaleString()}원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span style={{ fontSize: 13, color: colors.mediumGray }}>상품 할인</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.primaryGreen }}>-{((product.originalPrice - product.salePrice) * qty).toLocaleString()}원</span>
          </div>
          {couponDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span style={{ fontSize: 13, color: colors.mediumGray }}>쿠폰 할인</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.primaryGreen }}>-{couponDiscount.toLocaleString()}원</span>
            </div>
          )}
          <div style={{ borderTop: `2px solid ${colors.softGray}`, marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: colors.charcoalBlack }}>최종 결제</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: colors.primaryGreen }}>{finalPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 구매 전 필수 확인 */}
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

      {/* 결제 버튼 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: colors.white, borderTop: `1px solid ${colors.softGray}`,
        padding: '12px 16px 28px', zIndex: 90,
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
          {allChecked ? `${finalPrice.toLocaleString()}원 결제하기` : '위 내용을 모두 확인해주세요'}
        </button>
      </div>

      {/* 쿠폰 선택 바텀시트 */}
      {showCouponSheet && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowCouponSheet(false)}
        >
          <div
            style={{ background: colors.white, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 430, padding: '20px 16px 40px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>쿠폰 선택</span>
              <button onClick={() => setShowCouponSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={22} color={colors.charcoalBlack} />
              </button>
            </div>

            {availableCoupons.map(coupon => {
              const discount = calcCouponDiscount(coupon, subtotal);
              const isSelected = selectedCoupon?.id === coupon.id;
              return (
                <button
                  key={coupon.id}
                  onClick={() => { setSelectedCoupon(isSelected ? null : coupon); setShowCouponSheet(false); }}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: isSelected ? colors.freshMint : colors.softGray,
                    border: `1.5px solid ${isSelected ? colors.primaryGreen : 'transparent'}`,
                    borderRadius: 14, padding: '14px 16px',
                    marginBottom: 10, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>{coupon.name}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: colors.mediumGray }}>
                      최소 주문 {coupon.minOrderAmount.toLocaleString()}원 · ~{coupon.endDate}
                    </p>
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 900, color: colors.primaryGreen, flexShrink: 0, marginLeft: 12 }}>
                    -{discount.toLocaleString()}원
                  </span>
                </button>
              );
            })}

            {/* 사용 불가 쿠폰 */}
            {coupons.filter(c => subtotal < c.minOrderAmount).map(coupon => (
              <div
                key={coupon.id}
                style={{
                  background: colors.softGray, borderRadius: 14, padding: '14px 16px',
                  marginBottom: 10, opacity: 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>{coupon.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: colors.alertRed }}>
                    최소 주문 {coupon.minOrderAmount.toLocaleString()}원 이상 사용 가능
                  </p>
                </div>
                <span style={{ fontSize: 13, color: colors.mediumGray, flexShrink: 0, marginLeft: 12 }}>
                  {coupon.discountType === '정액' ? `${coupon.discountValue.toLocaleString()}원 할인` : `${coupon.discountValue}% 할인`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
