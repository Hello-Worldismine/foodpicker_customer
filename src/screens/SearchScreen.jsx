import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { colors } from '../theme';
import ProductCard from '../components/ProductCard';
import { products } from '../mockData';

const FILTERS = {
  distance: ['500m', '1km', '3km', '5km'],
  price: ['3천원 이하', '5천원 이하', '1만원 이하'],
  discount: ['30% 이상', '50% 이상', '70% 이상'],
  pickup: ['지금 가능', '오늘 저녁', '내일 오전'],
  category: ['빵', '도시락', '샐러드', '반찬', '디저트', '음료'],
  expiry: ['오늘까지', '내일까지'],
};

const SORT_OPTIONS = ['가까운 순', '마감 임박 순', '할인율 높은 순', '낮은 가격 순', '인기순'];

export default function SearchScreen({ onProductPress, onStorePress, onLike, productList }) {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('가까운 순');
  const [showSort, setShowSort] = useState(false);
  const [searched, setSearched] = useState(false);

  function toggleFilter(group, val) {
    setActiveFilters(prev => {
      const cur = prev[group] || [];
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      return { ...prev, [group]: next };
    });
  }

  function activeCount() {
    return Object.values(activeFilters).flat().length;
  }

  function clearFilters() {
    setActiveFilters({});
  }

  const allSelling = productList.filter(p =>
    p.status === 'selling' && p.stock > 0 && new Date(p.expiryDate) > new Date()
  );

  let results = allSelling.filter(p => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) &&
        !p.store.toLowerCase().includes(query.toLowerCase())) return false;
    const cats = activeFilters.category || [];
    if (cats.length > 0 && !cats.includes(p.category)) return false;
    return true;
  });

  if (sortBy === '가까운 순') results = [...results].sort((a, b) => a.distance - b.distance);
  else if (sortBy === '할인율 높은 순') results = [...results].sort((a, b) => b.discountRate - a.discountRate);
  else if (sortBy === '낮은 가격 순') results = [...results].sort((a, b) => a.salePrice - b.salePrice);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.softGray }}>
      {/* Search header */}
      <div style={{ background: colors.white, padding: '14px 16px 0', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10,
        }}>
          <div style={{
            flex: 1,
            background: colors.softGray,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            gap: 8,
          }}>
            <Search size={16} color={colors.mediumGray} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setSearched(true); }}
              onKeyDown={e => e.key === 'Enter' && setSearched(true)}
              placeholder="상품명, 매장명으로 검색"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 14, color: colors.charcoalBlack,
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={14} color={colors.mediumGray} />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilter(!showFilter)} style={{
            background: activeCount() > 0 ? colors.primaryGreen : colors.white,
            border: `1.5px solid ${activeCount() > 0 ? colors.primaryGreen : '#E8EAED'}`,
            borderRadius: 12,
            padding: '10px 12px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          }}>
            <SlidersHorizontal size={16} color={activeCount() > 0 ? colors.white : colors.charcoalBlack} />
            {activeCount() > 0 && (
              <span style={{ fontSize: 12, color: colors.white, fontWeight: 700 }}>{activeCount()}</span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div style={{ padding: '0 0 12px', borderTop: `1px solid ${colors.softGray}`, marginTop: 4 }}>
            {Object.entries(FILTERS).map(([group, options]) => (
              <div key={group} style={{ marginTop: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: colors.mediumGray }}>
                  {{ distance: '거리', price: '가격', discount: '할인율', pickup: '픽업시간', category: '카테고리', expiry: '소비기한' }[group]}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {options.map(opt => {
                    const active = (activeFilters[group] || []).includes(opt);
                    return (
                      <button key={opt} onClick={() => toggleFilter(group, opt)} style={{
                        background: active ? colors.freshMint : colors.softGray,
                        color: active ? colors.primaryGreen : colors.charcoalBlack,
                        border: `1.5px solid ${active ? colors.primaryGreen : 'transparent'}`,
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 13,
                        fontWeight: active ? 700 : 400,
                        cursor: 'pointer',
                      }}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            {activeCount() > 0 && (
              <button onClick={clearFilters} style={{
                marginTop: 12,
                background: 'none',
                border: `1px solid ${colors.mediumGray}`,
                borderRadius: 8,
                padding: '7px 14px',
                fontSize: 13,
                color: colors.mediumGray,
                cursor: 'pointer',
              }}>
                필터 초기화
              </button>
            )}
          </div>
        )}

        {/* Sort & count row */}
        {searched && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0 10px',
            borderTop: `1px solid ${colors.softGray}`,
          }}>
            <span style={{ fontSize: 13, color: colors.mediumGray }}>
              결과 <strong style={{ color: colors.charcoalBlack }}>{results.length}개</strong>
            </span>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowSort(!showSort)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, color: colors.charcoalBlack, fontWeight: 600,
              }}>
                {sortBy} <ChevronDown size={14} />
              </button>
              {showSort && (
                <div style={{
                  position: 'absolute', right: 0, top: 28, background: colors.white,
                  borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  overflow: 'hidden', zIndex: 50, minWidth: 140,
                }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }} style={{
                      display: 'block', width: '100%', padding: '11px 14px',
                      background: sortBy === opt ? colors.freshMint : colors.white,
                      border: 'none', cursor: 'pointer',
                      fontSize: 13, color: sortBy === opt ? colors.primaryGreen : colors.charcoalBlack,
                      fontWeight: sortBy === opt ? 700 : 400,
                      textAlign: 'left',
                    }}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 100px' }}>
        {!searched ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>검색어를 입력하거나<br />필터로 상품을 찾아보세요</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>검색 결과가 없습니다</p>
          </div>
        ) : (
          results.map(p => (
            <ProductCard key={p.id} product={p} onPress={onProductPress} onLike={onLike} onStorePress={onStorePress} />
          ))
        )}
      </div>
    </div>
  );
}
