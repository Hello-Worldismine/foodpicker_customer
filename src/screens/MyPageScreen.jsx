import { CreditCard, Bell, HelpCircle, FileText, LogOut, UserX, ChevronRight, User, ClipboardList, Ticket } from 'lucide-react';
import { colors } from '../theme';

export default function MyPageScreen({ onTermsPress, orders = [], onOrdersPress, coupons = [], onCouponsPress }) {
  const envStats = [
    { label: '구한 음식', value: '12개' },
    { label: '예상 절감', value: '38,000원' },
    { label: '폐기 감소', value: '4.2kg' },
  ];

  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'pickupReady').length;

  const menuItems = [
    { key: 'orders',    icon: ClipboardList, label: '주문내역',            color: colors.charcoalBlack, onPress: onOrdersPress,  badge: pendingCount > 0 ? pendingCount : null },
    { key: 'coupons',   icon: Ticket,        label: '쿠폰함',              color: colors.charcoalBlack, onPress: onCouponsPress, badge: coupons.length > 0 ? `${coupons.length}장` : null },
    { key: 'payment',   icon: CreditCard,    label: '결제수단 관리',        color: colors.charcoalBlack },
    { key: 'notifications', icon: Bell,      label: '알림 설정',            color: colors.charcoalBlack },
    { key: 'support',   icon: HelpCircle,    label: '고객센터',             color: colors.charcoalBlack },
    { key: 'faq',       icon: FileText,      label: '자주 묻는 질문',       color: colors.charcoalBlack },
    { key: 'terms',     icon: FileText,      label: '약관 및 개인정보처리방침', color: colors.charcoalBlack, onPress: onTermsPress },
  ];

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* Profile */}
      <div style={{ background: colors.white, padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: colors.freshMint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={28} color={colors.primaryGreen} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: colors.charcoalBlack }}>홍길동</p>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: colors.mediumGray }}>gildong@email.com</p>
          </div>
          <button style={{
            marginLeft: 'auto',
            background: colors.softGray,
            border: 'none', borderRadius: 8, padding: '7px 12px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', color: colors.charcoalBlack,
          }}>편집</button>
        </div>

        {/* 환경 기여 인라인 stats */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {envStats.map(s => (
            <div key={s.label} style={{
              flex: 1, background: colors.freshMint, borderRadius: 12,
              padding: '10px 8px', textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: colors.primaryGreen }}>{s.value}</p>
              <p style={{ margin: '2px 0 0', fontSize: 10, color: colors.mediumGray }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 11, color: colors.mediumGray, textAlign: 'center' }}>
          * 수치는 예상값입니다
        </p>
      </div>

      <div style={{ padding: '12px 16px 100px' }}>
        {/* Main menus */}
        <div style={{ background: colors.white, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={item.onPress} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '15px 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: idx < menuItems.length - 1 ? `1px solid ${colors.softGray}` : 'none',
              }}>
                <Icon size={18} color={item.color} />
                <span style={{ flex: 1, fontSize: 15, color: colors.charcoalBlack, textAlign: 'left' }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: item.key === 'coupons' ? colors.freshMint : colors.primaryGreen,
                    color: item.key === 'coupons' ? colors.primaryGreen : colors.white,
                    fontSize: 11, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 20, marginRight: 6,
                    border: item.key === 'coupons' ? `1px solid ${colors.primaryGreen}` : 'none',
                  }}>{item.badge}</span>
                )}
                <ChevronRight size={16} color={colors.mediumGray} />
              </button>
            );
          })}
        </div>

        {/* Account actions */}
        <div style={{ background: colors.white, borderRadius: 16, overflow: 'hidden' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '15px 16px', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `1px solid ${colors.softGray}`,
          }}>
            <LogOut size={18} color={colors.mediumGray} />
            <span style={{ fontSize: 15, color: colors.mediumGray }}>로그아웃</span>
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '15px 16px', background: 'none', border: 'none', cursor: 'pointer',
          }}>
            <UserX size={18} color={colors.alertRed} />
            <span style={{ fontSize: 15, color: colors.alertRed }}>회원탈퇴</span>
          </button>
        </div>

        <p style={{ margin: '16px 0 0', fontSize: 12, color: colors.mediumGray, textAlign: 'center' }}>
          푸드피커 v1.0.0
        </p>
      </div>
    </div>
  );
}
