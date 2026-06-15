import { ArrowLeft, Heart, Megaphone, ShoppingBag, MapPin } from 'lucide-react';
import { colors } from '../theme';

// 알림 타입 정의
const NOTIF_TYPES = {
  liked_closing: {
    icon: Heart,
    iconBg: '#FFF0F0',
    iconColor: '#E53E3E',
    label: '찜 상품 알림',
  },
  ad: {
    icon: Megaphone,
    iconBg: colors.freshMint,
    iconColor: colors.primaryGreen,
    label: '이벤트/광고',
  },
  order_complete: {
    icon: ShoppingBag,
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    label: '결제 완료',
  },
  pickup: {
    icon: MapPin,
    iconBg: '#FFF8E6',
    iconColor: colors.warmOrange,
    label: '픽업 안내',
  },
};

// 목 알림 데이터 — 추후 API로 교체
const mockNotifications = [
  {
    id: 1,
    type: 'pickup',
    title: '픽업 시간이 다가오고 있어요!',
    body: '그린샐러드 강남점 픽업 시간까지 30분 남았습니다. 준비해 주세요 🏃',
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15분 전
    read: false,
  },
  {
    id: 2,
    type: 'order_complete',
    title: '결제가 완료됐어요',
    body: '닭가슴살 샐러드 결제가 완료됐습니다. 픽업번호: FP-1024',
    time: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40분 전
    read: false,
  },
  {
    id: 3,
    type: 'liked_closing',
    title: '찜한 상품이 마감임박이에요!',
    body: '딸기 생크림 케이크 조각 (파리바게뜨 선릉점) — 오늘 21:30 마감, 재고 2개 남았어요.',
    time: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5시간 전
    read: false,
  },
  {
    id: 4,
    type: 'ad',
    title: '베이커리 특가 이벤트 🥐',
    body: '오늘 하루만! 베이커리 상품 전체 추가 10% 할인. 지금 바로 확인해보세요.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3시간 전
    read: true,
  },
  {
    id: 5,
    type: 'liked_closing',
    title: '찜한 상품이 마감임박이에요!',
    body: '아메리카노 + 샌드위치 세트 (카페블랑 강남점) — 오늘 18:00 마감, 재고 6개.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
    read: true,
  },
  {
    id: 6,
    type: 'order_complete',
    title: '결제가 완료됐어요',
    body: '통밀 크로와상 2개입 결제가 완료됐습니다. 픽업번호: FP-1018',
    time: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(), // 1일 전
    read: true,
  },
  {
    id: 7,
    type: 'pickup',
    title: '픽업 완료! 맛있게 드세요 😊',
    body: '통밀 크로와상 2개입 픽업이 확인됐습니다. 이용해 주셔서 감사합니다.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1일 전
    read: true,
  },
  {
    id: 8,
    type: 'ad',
    title: '주변에 새 매장이 생겼어요! 🏪',
    body: '강남구에 새로운 파트너 매장 자연반찬 강남점이 오픈했습니다. 첫 구매 할인 혜택을 확인해보세요.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3일 전
    read: true,
  },
];

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

// 날짜 그룹 라벨
function getDateGroup(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (day === 0) return '오늘';
  if (day === 1) return '어제';
  if (day < 7) return '이번 주';
  return '이전';
}

export default function NotificationScreen({ onBack }) {
  // 날짜 그룹별로 묶기
  const groups = [];
  const seen = new Set();
  mockNotifications.forEach(n => {
    const g = getDateGroup(n.time);
    if (!seen.has(g)) { seen.add(g); groups.push({ label: g, items: [] }); }
    groups[groups.length - 1].items.push(n);
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* 헤더 */}
      <div style={{
        background: colors.white,
        position: 'sticky', top: 0, zIndex: 20,
        borderBottom: `1px solid ${colors.softGray}`,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
          <ArrowLeft size={22} color={colors.charcoalBlack} />
        </button>
        <span style={{ flex: 1, fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>알림</span>
        {unreadCount > 0 && (
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: colors.primaryGreen,
            background: colors.freshMint,
            padding: '3px 10px', borderRadius: 20,
          }}>
            새 알림 {unreadCount}
          </span>
        )}
      </div>

      <div style={{ padding: '12px 16px 40px' }}>
        {groups.map(group => (
          <div key={group.label}>
            {/* 날짜 그룹 헤더 */}
            <p style={{
              margin: '8px 0 8px',
              fontSize: 12, fontWeight: 700,
              color: colors.mediumGray,
              letterSpacing: 0.3,
            }}>
              {group.label}
            </p>

            {group.items.map(notif => {
              const typeInfo = NOTIF_TYPES[notif.type] || NOTIF_TYPES.ad;
              const Icon = typeInfo.icon;
              return (
                <div
                  key={notif.id}
                  style={{
                    background: notif.read ? colors.white : '#F0FAF4',
                    borderRadius: 16,
                    padding: '14px 16px',
                    marginBottom: 8,
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    border: notif.read ? 'none' : `1.5px solid ${colors.primaryGreen}22`,
                  }}
                >
                  {/* 타입 아이콘 */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                    background: typeInfo.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <Icon size={20} color={typeInfo.iconColor} />
                    {/* 안 읽음 점 */}
                    {!notif.read && (
                      <span style={{
                        position: 'absolute', top: -3, right: -3,
                        width: 10, height: 10,
                        background: colors.primaryGreen,
                        borderRadius: '50%',
                        border: `2px solid ${colors.white}`,
                      }} />
                    )}
                  </div>

                  {/* 내용 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: typeInfo.iconColor,
                        background: typeInfo.iconBg,
                        padding: '2px 7px', borderRadius: 6,
                      }}>
                        {typeInfo.label}
                      </span>
                      <span style={{ fontSize: 11, color: colors.mediumGray, flexShrink: 0, marginLeft: 8 }}>
                        {formatTime(notif.time)}
                      </span>
                    </div>
                    <p style={{
                      margin: '4px 0 2px', fontSize: 14, fontWeight: 700,
                      color: colors.charcoalBlack,
                    }}>
                      {notif.title}
                    </p>
                    <p style={{
                      margin: 0, fontSize: 13, color: colors.mediumGray,
                      lineHeight: 1.55,
                    }}>
                      {notif.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {mockNotifications.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🔔</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>새로운 알림이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
