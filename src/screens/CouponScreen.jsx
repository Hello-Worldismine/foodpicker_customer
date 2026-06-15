import { useState } from 'react';
import { ArrowLeft, Tag, ChevronRight, Ticket } from 'lucide-react';
import { colors } from '../theme';

const TABS = [
  { key: 'available', label: '사용 가능' },
  { key: 'used',      label: '사용 완료' },
];

// 임시 사용 완료 쿠폰 목 데이터
const USED_COUPONS = [
  {
    id: 'CPN-000',
    name: '첫 주문 감사 쿠폰',
    discountType: '정액',
    discountValue: 2000,
    minOrderAmount: 5000,
    endDate: '2024.05.31',
    usedAt: '2024.05.20',
  },
];

function discountLabel(coupon) {
  if (coupon.discountType === '정액') return `${coupon.discountValue.toLocaleString()}원 할인`;
  return `${coupon.discountValue}% 할인`;
}

function CouponCard({ coupon, used = false }) {
  return (
    <div style={{
      background: used ? colors.softGray : colors.white,
      borderRadius: 16,
      marginBottom: 10,
      overflow: 'hidden',
      opacity: used ? 0.65 : 1,
      boxShadow: used ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
    }}>
      {/* 상단: 할인 금액 강조 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        gap: 12,
        borderBottom: `1.5px dashed ${used ? colors.mediumGray : colors.freshMint}`,
      }}>
        {/* 아이콘 */}
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: used ? '#EBEBEB' : colors.freshMint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ticket size={22} color={used ? colors.mediumGray : colors.primaryGreen} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: 19, fontWeight: 900,
            color: used ? colors.mediumGray : colors.primaryGreen,
          }}>
            {discountLabel(coupon)}
          </p>
          <p style={{
            margin: '2px 0 0',
            fontSize: 13, fontWeight: 600,
            color: colors.charcoalBlack,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {coupon.name}
          </p>
        </div>

        {used && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: colors.mediumGray,
            background: '#E0E0E0',
            padding: '3px 8px', borderRadius: 8,
            flexShrink: 0,
          }}>사용 완료</span>
        )}
      </div>

      {/* 하단: 조건 정보 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 16px',
      }}>
        <span style={{ fontSize: 12, color: colors.mediumGray }}>
          {coupon.minOrderAmount.toLocaleString()}원 이상 결제 시
        </span>
        <span style={{ fontSize: 12, color: used ? colors.mediumGray : colors.charcoalBlack, fontWeight: 600 }}>
          {used ? `사용일 ${coupon.usedAt}` : `~${coupon.endDate}`}
        </span>
      </div>
    </div>
  );
}

export default function CouponScreen({ coupons = [], onBack }) {
  const [tab, setTab] = useState('available');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  function handleRegister() {
    if (!code.trim()) {
      setCodeError('쿠폰 코드를 입력해주세요.');
      setCodeSuccess('');
      return;
    }
    // 실제 서버 연동 전 임시 처리
    setCodeError('');
    setCodeSuccess('유효하지 않은 쿠폰 코드입니다.');
    setCode('');
  }

  const listToShow = tab === 'available' ? coupons : USED_COUPONS;

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
        <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>쿠폰함</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 13, fontWeight: 700,
          color: colors.primaryGreen,
        }}>
          {coupons.length}장 보유
        </span>
      </div>

      {/* 쿠폰 코드 등록 */}
      <div style={{ background: colors.white, padding: '14px 16px', marginBottom: 8 }}>
        <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>
          쿠폰 코드 등록
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={code}
            onChange={e => { setCode(e.target.value); setCodeError(''); setCodeSuccess(''); }}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            placeholder="쿠폰 코드를 입력하세요"
            style={{
              flex: 1,
              padding: '11px 14px',
              border: `1.5px solid ${codeError ? colors.alertRed : colors.softGray}`,
              borderRadius: 10,
              fontSize: 14,
              outline: 'none',
              background: colors.softGray,
              color: colors.charcoalBlack,
            }}
          />
          <button onClick={handleRegister} style={{
            padding: '11px 18px',
            background: colors.primaryGreen,
            color: colors.white,
            border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            flexShrink: 0,
          }}>
            등록
          </button>
        </div>
        {codeError && (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: colors.alertRed }}>{codeError}</p>
        )}
        {codeSuccess && (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: colors.alertRed }}>{codeSuccess}</p>
        )}
      </div>

      {/* 탭 */}
      <div style={{
        background: colors.white,
        display: 'flex',
        borderBottom: `2px solid ${colors.softGray}`,
        marginBottom: 8,
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1,
            padding: '12px 0',
            background: 'none', border: 'none',
            borderBottom: `2.5px solid ${tab === t.key ? colors.primaryGreen : 'transparent'}`,
            fontSize: 14,
            fontWeight: tab === t.key ? 800 : 400,
            color: tab === t.key ? colors.primaryGreen : colors.mediumGray,
            cursor: 'pointer',
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* 쿠폰 목록 */}
      <div style={{ padding: '4px 16px 100px' }}>
        {listToShow.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 72 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎟️</div>
            <p style={{ fontSize: 15, color: colors.mediumGray, margin: 0 }}>
              {tab === 'available' ? '보유한 쿠폰이 없습니다' : '사용한 쿠폰이 없습니다'}
            </p>
          </div>
        ) : (
          listToShow.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} used={tab === 'used'} />
          ))
        )}
      </div>
    </div>
  );
}
