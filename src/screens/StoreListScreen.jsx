import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { colors } from '../theme';

const STATUS_LABELS = {
  selling: { label: '판매중',  color: colors.primaryGreen, bg: colors.freshMint },
  closing: { label: '마감임박', color: '#B45309',           bg: '#FEF3C7' },
  soldout: { label: '품절',    color: colors.mediumGray,   bg: colors.softGray },
};

const STORE_EMOJI = {
  '샐러드': '🥗',
  '빵': '🥐',
  '도시락': '🍱',
  '반찬': '🥡',
  '음료': '☕',
  '디저트': '🍰',
};

const DISTANCE_FILTERS = [
  { label: '500m 이내', max: 500 },
  { label: '1km 이내',  max: 1000 },
  { label: '3km 이내',  max: 3000 },
  { label: '5km 이내',  max: 5000 },
];

const CATEGORY_FILTERS = ['빵', '도시락', '샐러드', '반찬', '디저트', '음료'];
const STATUS_FILTERS   = ['판매중', '마감임박', '품절'];

function distLabel(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
}

export default function StoreListScreen({ stores, onBack, onStorePress }) {
  const [showFilter, setShowFilter] = useState(false);
  const [selDistance, setSelDistance] = useState(null);   // { label, max } | null
  const [selCategories, setSelCategories] = useState([]); // string[]
  const [selStatuses, setSelStatuses] = useState([]);     // string[]

  function toggleCategory(cat) {
    setSelCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }
  function toggleStatus(st) {
    setSelStatuses(prev =>
      prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st]
    );
  }

  const activeCount =
    (selDistance ? 1 : 0) + selCategories.length + selStatuses.length;

  function clearAll() {
    setSelDistance(null);
    setSelCategories([]);
    setSelStatuses([]);
  }

  // 필터링
  let list = [...stores];
  if (selDistance) list = list.filter(s => s.distance <= selDistance.max);
  if (selCategories.length > 0) list = list.filter(s => selCategories.includes(s.category));
  if (selStatuses.length > 0) {
    list = list.filter(s => {
      const lbl = STATUS_LABELS[s.status]?.label || '';
      return selStatuses.includes(lbl);
    });
  }

  // 기본 정렬: 가까운 순
  list.sort((a, b) => a.distance - b.distance);

  return (
    <div style={{ background: colors.softGray, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* 헤더 */}
      <div style={{ background: colors.white, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
            <ArrowLeft size={22} color={colors.charcoalBlack} />
          </button>
          <span style={{ flex: 1, fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>내 주변 매장</span>
        </div>

        {/* 필터 패널 */}
        {showFilter && (
          <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${colors.softGray}` }}>

            {/* 거리 */}
            <p style={{ margin: '12px 0 8px', fontSize: 12, fontWeight: 700, color: colors.mediumGray }}>거리</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {DISTANCE_FILTERS.map(d => {
                const active = selDistance?.label === d.label;
                return (
                  <button key={d.label} onClick={() => setSelDistance(active ? null : d)} style={{
                    background: active ? colors.freshMint : colors.softGray,
                    color: active ? colors.primaryGreen : colors.charcoalBlack,
                    border: `1.5px solid ${active ? colors.primaryGreen : 'transparent'}`,
                    borderRadius: 8, padding: '6px 12px', fontSize: 13,
                    fontWeight: active ? 700 : 400, cursor: 'pointer',
                  }}>{d.label}</button>
                );
              })}
            </div>

            {/* 카테고리 */}
            <p style={{ margin: '12px 0 8px', fontSize: 12, fontWeight: 700, color: colors.mediumGray }}>카테고리</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORY_FILTERS.map(cat => {
                const active = selCategories.includes(cat);
                return (
                  <button key={cat} onClick={() => toggleCategory(cat)} style={{
                    background: active ? colors.freshMint : colors.softGray,
                    color: active ? colors.primaryGreen : colors.charcoalBlack,
                    border: `1.5px solid ${active ? colors.primaryGreen : 'transparent'}`,
                    borderRadius: 8, padding: '6px 12px', fontSize: 13,
                    fontWeight: active ? 700 : 400, cursor: 'pointer',
                  }}>{cat}</button>
                );
              })}
            </div>

            {/* 운영 상태 */}
            <p style={{ margin: '12px 0 8px', fontSize: 12, fontWeight: 700, color: colors.mediumGray }}>운영 상태</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {STATUS_FILTERS.map(st => {
                const active = selStatuses.includes(st);
                return (
                  <button key={st} onClick={() => toggleStatus(st)} style={{
                    background: active ? colors.freshMint : colors.softGray,
                    color: active ? colors.primaryGreen : colors.charcoalBlack,
                    border: `1.5px solid ${active ? colors.primaryGreen : 'transparent'}`,
                    borderRadius: 8, padding: '6px 12px', fontSize: 13,
                    fontWeight: active ? 700 : 400, cursor: 'pointer',
                  }}>{st}</button>
                );
              })}
            </div>

            {activeCount > 0 && (
              <button onClick={clearAll} style={{
                marginTop: 12, background: 'none',
                border: `1px solid ${colors.mediumGray}`,
                borderRadius: 8, padding: '7px 14px',
                fontSize: 13, color: colors.mediumGray, cursor: 'pointer',
              }}>필터 초기화</button>
            )}
          </div>
        )}

        {/* 결과 수 + 필터 버튼 */}
        <div style={{ padding: '6px 16px 10px', borderTop: `1px solid ${colors.softGray}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: colors.mediumGray }}>
            매장 <strong style={{ color: colors.charcoalBlack }}>{list.length}개</strong>
          </span>
          <button
            onClick={() => setShowFilter(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: activeCount > 0 ? colors.primaryGreen : colors.white,
              border: `1.5px solid ${activeCount > 0 ? colors.primaryGreen : '#E8EAED'}`,
              borderRadius: 10, padding: '6px 12px', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} color={activeCount > 0 ? colors.white : colors.charcoalBlack} />
            {activeCount > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.white }}>{activeCount}</span>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: activeCount > 0 ? colors.white : colors.charcoalBlack }}>필터</span>
          </button>
        </div>
      </div>

      {/* 매장 목록 */}
      <div style={{ flex: 1, padding: '10px 16px 100px' }}>
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 70 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>조건에 맞는 매장이 없습니다</p>
          </div>
        ) : (
          list.map(s => {
            const st = STATUS_LABELS[s.status] || STATUS_LABELS.selling;
            const emoji = STORE_EMOJI[s.category] || '🏪';
            return (
              <div
                key={s.id}
                onClick={() => onStorePress && onStorePress(s.id)}
                style={{
                  background: colors.white, borderRadius: 16,
                  padding: '16px', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', boxShadow: '0 1px 5px rgba(0,0,0,0.07)',
                }}
              >
                {/* 로고 영역 */}
                <div style={{
                  width: 54, height: 54, borderRadius: 14, flexShrink: 0,
                  background: colors.freshMint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                }}>
                  {emoji}
                </div>

                {/* 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.charcoalBlack, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </p>
                    <span style={{
                      flexShrink: 0, fontSize: 11, fontWeight: 700,
                      color: st.color, background: st.bg,
                      padding: '2px 7px', borderRadius: 6,
                    }}>{st.label}</span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: colors.mediumGray }}>
                    {distLabel(s.distance)} · 상품 {s.productCount}개 · 픽업 {s.pickupTime}
                  </p>
                  {s.category && (
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: colors.primaryGreen, fontWeight: 600 }}>
                      #{s.category}
                    </p>
                  )}
                </div>

                <ChevronRight size={16} color={colors.mediumGray} style={{ flexShrink: 0 }} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
