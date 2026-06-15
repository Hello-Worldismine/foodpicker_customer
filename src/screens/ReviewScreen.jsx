import { useState } from 'react';
import { ArrowLeft, Star, ThumbsUp, ChevronDown, Megaphone } from 'lucide-react';
import { colors } from '../theme';

// 목 리뷰 데이터 — 추후 API로 교체
const mockReviewData = {
  1: {
    ownerNotice: '안녕하세요, 그린샐러드 강남점입니다 🥗\n매일 신선한 재료만 사용하며, 항상 최상의 품질을 약속드립니다.\n맛있게 드셨다면 리뷰 남겨주세요! 큰 힘이 됩니다 😊',
    ownerNoticeDate: '2024.05.20',
    distribution: { 5: 98, 4: 18, 3: 5, 2: 2, 1: 1 },
    reviews: [
      { id: 1, user: '김민정', rating: 5, date: '2024.06.14', text: '샐러드가 정말 신선하고 맛있어요! 가성비 최고입니다. 매일 먹고 싶을 정도예요.', helpful: 8, ownerReply: '소중한 리뷰 감사해요! 앞으로도 신선하고 맛있는 샐러드로 보답하겠습니다 😊' },
      { id: 2, user: '이준혁', rating: 5, date: '2024.06.12', text: '닭가슴살이 촉촉하고 드레싱도 맛있어요. 다이어트 중인데 딱 좋습니다.', helpful: 5, ownerReply: null },
      { id: 3, user: '박소연', rating: 4, date: '2024.06.10', text: '신선하고 양이 충분해요. 다음에도 구매할 것 같아요.', helpful: 3, ownerReply: null },
      { id: 4, user: '최현우', rating: 5, date: '2024.06.08', text: '픽업도 편하고 상품도 너무 좋았어요! 강추합니다.', helpful: 2, ownerReply: '방문해 주셔서 감사합니다! 또 만나요 🙏' },
    ],
  },
  2: {
    ownerNotice: '베이커리온 역삼점을 찾아주셔서 감사합니다 🥐\n매일 새벽 4시부터 직접 구운 신선한 빵을 제공합니다.\n재고 소진 시 조기 마감될 수 있으니 서둘러 주세요!',
    ownerNoticeDate: '2024.04.10',
    distribution: { 5: 61, 4: 20, 3: 6, 2: 1, 1: 1 },
    reviews: [
      { id: 1, user: '정유진', rating: 5, date: '2024.06.13', text: '크로와상이 바삭하고 버터향이 좋아요. 자주 올게요!', helpful: 12, ownerReply: '감사합니다! 매일 정성껏 굽겠습니다 🥐' },
      { id: 2, user: '홍길동', rating: 4, date: '2024.06.11', text: '가격 대비 퀄리티가 너무 좋아요. 아침 대용으로 딱 좋습니다.', helpful: 7, ownerReply: null },
      { id: 3, user: '김지수', rating: 5, date: '2024.06.09', text: '매일 오고 싶을 정도로 맛있어요!', helpful: 4, ownerReply: null },
    ],
  },
  3: {
    ownerNotice: '한솥도시락 강남역점입니다 🍱\n국내산 재료만 사용하여 정성껏 만들고 있습니다.\n남은 도시락은 매일 마감 2시간 전 특가로 제공됩니다.',
    ownerNoticeDate: '2024.03.15',
    distribution: { 5: 130, 4: 52, 3: 14, 2: 3, 1: 2 },
    reviews: [
      { id: 1, user: '이민수', rating: 4, date: '2024.06.14', text: '불고기 도시락이 집밥 같은 맛이에요. 반찬도 맛있고요.', helpful: 9, ownerReply: '맛있게 드셨다니 정말 기쁩니다! 감사해요 😊' },
      { id: 2, user: '박지영', rating: 4, date: '2024.06.12', text: '양이 많고 맛있어요. 다음에 또 살게요!', helpful: 6, ownerReply: null },
      { id: 3, user: '강민준', rating: 5, date: '2024.06.10', text: '가성비 최고! 든든하게 먹었어요.', helpful: 3, ownerReply: null },
    ],
  },
  4: {
    ownerNotice: '파리바게뜨 선릉점입니다 🍰\n매일 신선한 케이크와 빵을 선보입니다.\n푸드피커를 통해 마감 할인 상품을 저렴하게 만나보세요!',
    ownerNoticeDate: '2024.06.01',
    distribution: { 5: 240, 4: 55, 3: 12, 2: 3, 1: 2 },
    reviews: [
      { id: 1, user: '오수현', rating: 5, date: '2024.06.13', text: '딸기 케이크가 너무 맛있어요. 생크림이 달지 않아서 좋았어요!', helpful: 15, ownerReply: '소중한 후기 감사드립니다! 자주 들러주세요 🍰' },
      { id: 2, user: '배민호', rating: 5, date: '2024.06.11', text: '할인 가격인데도 퀄리티가 훌륭해요.', helpful: 10, ownerReply: null },
      { id: 3, user: '윤세아', rating: 4, date: '2024.06.09', text: '신선한 딸기가 듬뿍 들어있어서 좋았어요.', helpful: 5, ownerReply: null },
    ],
  },
  5: {
    ownerNotice: '자연반찬 강남점입니다 🥡\n100% 국내산 재료로 당일 생산, 당일 판매를 원칙으로 합니다.\n건강한 한 끼 부탁드립니다!',
    ownerNoticeDate: '2024.05.05',
    distribution: { 5: 48, 4: 14, 3: 4, 2: 1, 1: 0 },
    reviews: [
      { id: 1, user: '임재현', rating: 5, date: '2024.06.14', text: '두부조림이 부드럽고 맛있어요. 집밥 같은 정성이 느껴져요.', helpful: 7, ownerReply: '건강하게 드셔주셔서 감사해요! 🙏' },
      { id: 2, user: '한예슬', rating: 4, date: '2024.06.12', text: '나물 반찬이 신선하고 맛있어요. 자주 올게요!', helpful: 4, ownerReply: null },
    ],
  },
  6: {
    ownerNotice: '카페블랑 강남점입니다 ☕\n에티오피아 스페셜티 원두로 매일 신선하게 로스팅합니다.\n음료는 픽업 시 바로 제조해드립니다. 맛있게 드세요!',
    ownerNoticeDate: '2024.06.10',
    distribution: { 5: 158, 4: 22, 3: 6, 2: 1, 1: 1 },
    reviews: [
      { id: 1, user: '조수빈', rating: 5, date: '2024.06.14', text: '아메리카노 향이 풍부하고 샌드위치도 신선해요!', helpful: 18, ownerReply: '항상 최고의 원두로 정성껏 내리겠습니다 ☕' },
      { id: 2, user: '신동욱', rating: 5, date: '2024.06.13', text: '스페셜티 원두 쓰는 게 티가 나요. 맛이 달라요.', helpful: 11, ownerReply: null },
      { id: 3, user: '김하늘', rating: 5, date: '2024.06.11', text: '픽업할 때 음료를 바로 만들어줘서 더 좋았어요.', helpful: 6, ownerReply: null },
      { id: 4, user: '이도현', rating: 4, date: '2024.06.09', text: '세트 가격이 합리적이에요. 다음에도 이용할 것 같아요.', helpful: 3, ownerReply: null },
    ],
  },
};

const SORT_OPTIONS = [
  { key: 'helpful', label: '추천순' },
  { key: 'recent', label: '최신순' },
  { key: 'high', label: '별점 높은순' },
  { key: 'low', label: '별점 낮은순' },
];

function RatingBar({ score, count, maxCount }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
      <span style={{ fontSize: 12, color: colors.mediumGray, width: 20, textAlign: 'right', flexShrink: 0 }}>
        {score}점
      </span>
      <div style={{ flex: 1, height: 6, background: colors.softGray, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: pct > 0 ? '#FFD700' : 'transparent',
          borderRadius: 3,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontSize: 12, color: colors.mediumGray, width: 28, flexShrink: 0 }}>{count}</span>
    </div>
  );
}

export default function ReviewScreen({ store, onBack }) {
  const [sort, setSort] = useState('helpful');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const data = mockReviewData[store.id] || {
    ownerNotice: null,
    ownerNoticeDate: null,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: [],
  };

  const maxCount = Math.max(...Object.values(data.distribution));
  const totalReviews = Object.values(data.distribution).reduce((a, b) => a + b, 0);

  // 정렬
  const sortedReviews = [...data.reviews].sort((a, b) => {
    if (sort === 'helpful') return b.helpful - a.helpful;
    if (sort === 'recent') return new Date(b.date) - new Date(a.date);
    if (sort === 'high') return b.rating - a.rating;
    if (sort === 'low') return a.rating - b.rating;
    return 0;
  });

  const currentSortLabel = SORT_OPTIONS.find(o => o.key === sort)?.label || '추천순';

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
        <span style={{ flex: 1, fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>리뷰</span>
      </div>

      <div style={{ padding: '12px 16px 40px' }}>

        {/* ── 평점 요약 카드 ── */}
        <div style={{
          background: colors.white, borderRadius: 16,
          padding: '20px 16px', marginBottom: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: colors.mediumGray }}>{store.name}</p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {/* 왼쪽: 숫자 + 별 */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: colors.charcoalBlack, lineHeight: 1 }}>
                {store.rating}
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 8, justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={16} color="#FFD700" fill={n <= Math.round(store.rating) ? '#FFD700' : 'none'} />
                ))}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: colors.mediumGray }}>
                {totalReviews.toLocaleString()}개
              </p>
            </div>

            {/* 오른쪽: 별점 분포 바 */}
            <div style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map(score => (
                <RatingBar
                  key={score}
                  score={score}
                  count={data.distribution[score] || 0}
                  maxCount={maxCount}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── 사장님 공지 ── */}
        {data.ownerNotice && (
          <div style={{
            background: colors.white, borderRadius: 16,
            padding: '16px', marginBottom: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: colors.primaryGreen,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Megaphone size={15} color={colors.white} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: colors.charcoalBlack }}>사장님 공지</span>
              </div>
              <span style={{ fontSize: 12, color: colors.mediumGray }}>{data.ownerNoticeDate}</span>
            </div>
            <p style={{
              margin: 0, fontSize: 13, color: '#444',
              lineHeight: 1.7, whiteSpace: 'pre-line',
            }}>
              {data.ownerNotice}
            </p>
          </div>
        )}

        {/* ── 리뷰 목록 헤더 ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>
            최근 리뷰 <span style={{ color: colors.primaryGreen }}>{sortedReviews.length}개</span>
          </span>

          {/* 정렬 드롭다운 */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortMenu(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: colors.white, border: `1px solid #E8EAED`,
                borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 13, color: colors.charcoalBlack, fontWeight: 600 }}>
                {currentSortLabel}
              </span>
              <ChevronDown size={14} color={colors.mediumGray} />
            </button>

            {showSortMenu && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 30,
                background: colors.white, borderRadius: 12,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                overflow: 'hidden', minWidth: 110,
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSort(opt.key); setShowSortMenu(false); }}
                    style={{
                      display: 'block', width: '100%',
                      padding: '11px 16px', textAlign: 'left',
                      background: sort === opt.key ? colors.freshMint : colors.white,
                      border: 'none', cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: sort === opt.key ? 700 : 400,
                      color: sort === opt.key ? colors.primaryGreen : colors.charcoalBlack,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 리뷰 카드 목록 ── */}
        {sortedReviews.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 50 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📝</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>아직 리뷰가 없습니다</p>
          </div>
        ) : (
          sortedReviews.map(review => (
            <div key={review.id} style={{
              background: colors.white, borderRadius: 16,
              padding: '16px', marginBottom: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              {/* 작성자 + 날짜 + 별점 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: colors.freshMint,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, color: colors.primaryGreen, flexShrink: 0,
                  }}>
                    {review.user[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>
                      {review.user}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: colors.mediumGray }}>{review.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} size={14} color="#FFD700" fill={n <= review.rating ? '#FFD700' : 'none'} />
                  ))}
                </div>
              </div>

              {/* 리뷰 내용 */}
              <p style={{
                margin: '0 0 12px', fontSize: 14,
                color: colors.charcoalBlack, lineHeight: 1.65,
              }}>
                {review.text}
              </p>

              {/* 도움돼요 버튼 */}
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: `1px solid ${colors.softGray}`,
                borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
              }}>
                <ThumbsUp size={13} color={colors.mediumGray} />
                <span style={{ fontSize: 12, color: colors.mediumGray }}>도움돼요 {review.helpful}</span>
              </button>

              {/* 사장님 댓글 */}
              {review.ownerReply && (
                <div style={{
                  marginTop: 12,
                  background: colors.softGray,
                  borderRadius: 10,
                  padding: '12px 14px',
                  borderLeft: `3px solid ${colors.primaryGreen}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: colors.primaryGreen,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 11, color: colors.white }}>사</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors.primaryGreen }}>사장님 댓글</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                    {review.ownerReply}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 정렬 메뉴 닫기용 오버레이 */}
      {showSortMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 25 }}
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
}
