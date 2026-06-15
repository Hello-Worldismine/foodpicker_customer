import { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, Search, SlidersHorizontal, X, ArrowLeft, ChevronRight, Grid2X2, Wheat, Box, Leaf, Utensils, Coffee, Clock, Cookie } from 'lucide-react';
import { colors } from '../theme';
import ProductCard from '../components/ProductCard';
import { stores, mockBannerAds } from '../mockData';
import StoreListScreen from './StoreListScreen';

// ─── 광고 배너 데이터 ──────────────────────────────────────
// TODO: 실제 서비스에서는 아래 mockBannerAds 대신 API 호출로 교체
// 예: const [ads, setAds] = useState([]);
//     useEffect(() => { fetch('/api/banners').then(r=>r.json()).then(setAds); }, []);
const ADS = mockBannerAds;

// ─── 카테고리 정의 ─────────────────────────────────────────
const CATEGORIES = [
  { key: '전체',    Icon: Grid2X2,   label: '전체',    iconBg: '#E9F8F1', iconColor: '#22A06B' },
  { key: '빵',     Icon: Wheat,     label: '빵',      iconBg: '#FEF3C7', iconColor: '#B45309' },
  { key: '도시락',  Icon: Box,       label: '도시락',  iconBg: '#FEE2E2', iconColor: '#B91C1C' },
  { key: '샐러드',  Icon: Leaf,      label: '샐러드',  iconBg: '#DCFCE7', iconColor: '#16A34A' },
  { key: '반찬',   Icon: Utensils,   label: '반찬',    iconBg: '#FFEDD5', iconColor: '#C2410C' },
  { key: '디저트',  Icon: Cookie,    label: '디저트',  iconBg: '#F3E8FF', iconColor: '#7E22CE' },
  { key: '음료',   Icon: Coffee,     label: '음료',    iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
  { key: '마감임박', Icon: Clock,    label: '마감임박', iconBg: '#FFE4E6', iconColor: '#BE123C' },
];

// ─── 필터/정렬 상수 ────────────────────────────────────────
const FILTERS = {
  distance: ['500m', '1km', '3km', '5km'],
  price: ['3천원 이하', '5천원 이하', '1만원 이하'],
  discount: ['30% 이상', '50% 이상', '70% 이상'],
  pickup: ['지금 가능', '오늘 저녁', '내일 오전'],
  expiry: ['오늘까지', '내일까지'],
};
const FILTER_LABELS = { distance: '거리', price: '가격', discount: '할인율', pickup: '픽업시간', expiry: '소비기한' };
const SORT_OPTIONS = ['가까운 순', '마감 임박 순', '할인율 높은 순', '낮은 가격 순'];

// ─── 자동 슬라이드 배너 ───────────────────────────────────
function AdBanner({ onBannerPress }) {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [phase, setPhase] = useState('idle');
  const pendingRef = useRef(null);
  const timerRef = useRef(null);

  function goTo(next) {
    if (phase !== 'idle') return;
    pendingRef.current = next;
    setPhase('exiting');
    setTimeout(() => {
      setDisplayIdx(pendingRef.current);
      setPhase('snap');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('entering');
          setTimeout(() => setPhase('idle'), 340);
        });
      });
    }, 300);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo((displayIdx + 1) % ADS.length);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [displayIdx, phase]);

  const ad = ADS[displayIdx];

  let transform = 'translateX(0)';
  let transition = 'none';
  if (phase === 'exiting')  { transform = 'translateX(-110%)'; transition = 'transform 0.3s cubic-bezier(.4,0,.2,1)'; }
  else if (phase === 'snap') { transform = 'translateX(110%)';  transition = 'none'; }
  else if (phase === 'entering') { transform = 'translateX(0)'; transition = 'transform 0.34s cubic-bezier(.4,0,.2,1)'; }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
      {/* imageUrl이 있으면 이미지, 없으면 fallback 그라디언트 */}
      {ad.imageUrl ? (
        <div onClick={() => onBannerPress && onBannerPress(ad)} style={{ borderRadius: 20, overflow: 'hidden', transform, transition, height: 160, position: 'relative', cursor: 'pointer' }}>
          <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: '#fff', whiteSpace: 'pre-line' }}>{ad.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{ad.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: ad.fallback.bg, borderRadius: 20, padding: '24px 20px', color: colors.white, position: 'relative', overflow: 'hidden', transform, transition }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: 30, bottom: -30, width: 80, height: 80, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, lineHeight: 1.35, whiteSpace: 'pre-line' }}>{ad.title}</p>
              <p style={{ margin: '8px 0 16px', fontSize: 13, opacity: 0.88 }}>{ad.description}</p>
              <button onClick={() => onBannerPress && onBannerPress(ad)} style={{ background: 'rgba(255,255,255,0.22)', color: colors.white, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {ad.btnLabel}
              </button>
            </div>
            <span style={{ fontSize: 52, lineHeight: 1, marginLeft: 8, flexShrink: 0 }}>{ad.fallback.emoji}</span>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
        {ADS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ width: i === displayIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === displayIdx ? colors.primaryGreen : '#D0D3D7', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

// ─── 카테고리 그리드 (프리미엄 디자인) ───────────────────
function CategoryGrid({ onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px 6px' }}>
      {CATEGORIES.map(cat => {
        const { Icon } = cat;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat)}
            style={{
              background: colors.white,
              border: '1.5px solid #EDEFF2',
              borderRadius: 14,
              cursor: 'pointer',
              padding: '14px 4px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'all 0.15s',
            }}
          >
            {/* 아이콘 원형 배경 */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: cat.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon size={20} color={cat.iconColor} strokeWidth={1.8} />
            </div>
            {/* 라벨 */}
            <span style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: colors.charcoalBlack,
              textAlign: 'center',
              letterSpacing: '-0.2px',
              lineHeight: 1,
            }}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── 매장 카드 (가로 스크롤용) ────────────────────────────
function StoreCard({ store, onClick }) {
  return (
    <div onClick={onClick} style={{ flexShrink: 0, width: 160, background: colors.white, borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
      <div style={{ height: 80, background: `linear-gradient(135deg, #E8F4E8, ${colors.freshMint})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, position: 'relative' }}>
        {store.name.includes('샐러드') ? '🥗' : store.name.includes('베이커리') || store.name.includes('바게뜨') ? '🥐' : store.name.includes('도시락') ? '🍱' : store.name.includes('반찬') ? '🥡' : store.name.includes('카페') ? '☕' : '🏪'}
        <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: store.status === 'selling' ? colors.primaryGreen : store.status === 'closing' ? colors.warmOrange : colors.mediumGray, border: '1.5px solid white' }} />
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.charcoalBlack, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{store.name}</p>
        <p style={{ margin: '3px 0 0', fontSize: 11, color: colors.mediumGray }}>{store.distance >= 1000 ? `${(store.distance/1000).toFixed(1)}km` : `${store.distance}m`} · 상품 {store.productCount}개</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: colors.warmOrange, fontWeight: 600 }}>픽업 {store.pickupTime}</p>
      </div>
    </div>
  );
}

// ─── 카테고리 브라우즈 화면 ───────────────────────────────
function CategoryBrowseScreen({ category, productList, onBack, onProductPress, onLike, onStorePress }) {
  const [sortBy, setSortBy] = useState('가까운 순');
  const [showSort, setShowSort] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  function toggleFilter(group, val) {
    setActiveFilters(prev => {
      const cur = prev[group] || [];
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      return { ...prev, [group]: next };
    });
  }
  function activeCount() { return Object.values(activeFilters).flat().length; }

  const selling = productList.filter(p => p.status === 'selling' && p.stock > 0 && new Date(p.expiryDate) > new Date());
  let filtered = category.key === '전체' ? selling
    : category.key === '마감임박' ? selling.filter(p => p.badges.includes('마감임박'))
    : selling.filter(p => p.category === category.key);

  // 추가 필터
  if ((activeFilters.pickup || []).length > 0) { /* 생략 */ }

  let sorted = [...filtered];
  if (sortBy === '가까운 순') sorted.sort((a, b) => a.distance - b.distance);
  else if (sortBy === '마감 임박 순') sorted.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
  else if (sortBy === '할인율 높은 순') sorted.sort((a, b) => b.discountRate - a.discountRate);
  else if (sortBy === '낮은 가격 순') sorted.sort((a, b) => a.salePrice - b.salePrice);

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* 헤더 */}
      <div style={{ background: colors.white, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
            <ArrowLeft size={22} color={colors.charcoalBlack} />
          </button>
          <span style={{ fontSize: 24 }}>{category.emoji}</span>
          <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>{category.label}</span>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: colors.mediumGray }}>{sorted.length}개</span>
        </div>

        {/* 정렬 + 필터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 12px', borderBottom: `1px solid ${colors.softGray}` }}>
          {/* 정렬 드롭다운 */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSort(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.softGray, border: 'none', borderRadius: 20, padding: '7px 12px', fontSize: 13, fontWeight: 600, color: colors.charcoalBlack, cursor: 'pointer' }}
            >
              {sortBy} <ChevronDown size={14} />
            </button>
            {showSort && (
              <div style={{ position: 'absolute', left: 0, top: 38, background: colors.white, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 50, minWidth: 150 }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }} style={{ display: 'block', width: '100%', padding: '11px 14px', background: sortBy === opt ? colors.freshMint : colors.white, border: 'none', cursor: 'pointer', fontSize: 13, color: sortBy === opt ? colors.primaryGreen : colors.charcoalBlack, fontWeight: sortBy === opt ? 700 : 400, textAlign: 'left' }}>{opt}</button>
                ))}
              </div>
            )}
          </div>

          {/* 필터 버튼 */}
          <button
            onClick={() => setShowFilter(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: activeCount() > 0 ? colors.primaryGreen : colors.softGray, border: 'none', borderRadius: 20, padding: '7px 12px', fontSize: 13, fontWeight: 600, color: activeCount() > 0 ? colors.white : colors.charcoalBlack, cursor: 'pointer' }}
          >
            <SlidersHorizontal size={14} />
            필터{activeCount() > 0 ? ` ${activeCount()}` : ''}
          </button>

          {/* 활성 필터 태그 */}
          {Object.entries(activeFilters).flatMap(([g, vals]) => vals.map(v => (
            <button key={`${g}-${v}`} onClick={() => toggleFilter(g, v)} style={{ display: 'flex', alignItems: 'center', gap: 3, background: colors.freshMint, border: `1px solid ${colors.primaryGreen}`, borderRadius: 20, padding: '5px 10px', fontSize: 12, color: colors.primaryGreen, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              {v} <X size={10} />
            </button>
          )))}
        </div>

        {/* 필터 패널 */}
        {showFilter && (
          <div style={{ padding: '12px 16px', background: colors.white, borderBottom: `1px solid ${colors.softGray}` }}>
            {Object.entries(FILTERS).map(([group, options]) => (
              <div key={group} style={{ marginBottom: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: colors.mediumGray }}>{FILTER_LABELS[group]}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {options.map(opt => {
                    const active = (activeFilters[group] || []).includes(opt);
                    return (
                      <button key={opt} onClick={() => toggleFilter(group, opt)} style={{ background: active ? colors.freshMint : colors.softGray, color: active ? colors.primaryGreen : colors.charcoalBlack, border: `1.5px solid ${active ? colors.primaryGreen : 'transparent'}`, borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: active ? 700 : 400, cursor: 'pointer' }}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            {activeCount() > 0 && (
              <button onClick={() => setActiveFilters({})} style={{ background: 'none', border: `1px solid ${colors.mediumGray}`, borderRadius: 8, padding: '6px 12px', fontSize: 13, color: colors.mediumGray, cursor: 'pointer' }}>초기화</button>
            )}
          </div>
        )}
      </div>

      {/* 상품 목록 */}
      <div style={{ padding: '12px 16px 100px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{category.emoji}</div>
            <p style={{ fontSize: 15, color: colors.mediumGray }}>{category.label} 상품이 없습니다</p>
          </div>
        ) : sorted.map(p => (
          <ProductCard key={p.id} product={p} onPress={onProductPress} onLike={onLike} onStorePress={onStorePress} />
        ))}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function HomeScreen({ onProductPress, onStorePress, onLike, productList, onNotificationPress }) {
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('가까운 순');
  const [showSort, setShowSort] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [browseCategory, setBrowseCategory] = useState(null);
  const [showStoreList, setShowStoreList] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fp_recent_searches') || '[]'); }
    catch { return []; }
  });

  function saveSearch(kw) {
    const trimmed = kw.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const next = [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 10);
      localStorage.setItem('fp_recent_searches', JSON.stringify(next));
      return next;
    });
  }

  function removeSearch(kw) {
    setRecentSearches(prev => {
      const next = prev.filter(s => s !== kw);
      localStorage.setItem('fp_recent_searches', JSON.stringify(next));
      return next;
    });
  }

  function clearAllSearches() {
    setRecentSearches([]);
    localStorage.removeItem('fp_recent_searches');
  }

  function applyKeyword(kw) {
    setQuery(kw);
    saveSearch(kw);
  }

  function toggleFilter(group, val) {
    setActiveFilters(prev => {
      const cur = prev[group] || [];
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      return { ...prev, [group]: next };
    });
  }
  function activeCount() { return Object.values(activeFilters).flat().length; }
  function exitSearch() { setSearchMode(false); setQuery(''); setActiveFilters({}); setSortBy('가까운 순'); setShowFilterSection(false); }

  // ── 전체 매장 보기 화면 ──
  if (showStoreList) {
    return (
      <StoreListScreen
        stores={stores}
        onBack={() => setShowStoreList(false)}
        onStorePress={onStorePress}
      />
    );
  }

  // ── 카테고리 브라우즈 화면 ──
  if (browseCategory) {
    return (
      <CategoryBrowseScreen
        category={browseCategory}
        productList={productList}
        onBack={() => setBrowseCategory(null)}
        onProductPress={onProductPress}
        onLike={onLike}
        onStorePress={onStorePress}
      />
    );
  }

  const selling = productList.filter(p => p.status === 'selling' && p.stock > 0 && new Date(p.expiryDate) > new Date());
  const queryLower = query.toLowerCase();
  const searchedProducts = selling.filter(p => query ? p.name.toLowerCase().includes(queryLower) : true);
  const searchedStores = stores.filter(s => query ? s.name.toLowerCase().includes(queryLower) : true);
  let sortedProducts = [...searchedProducts];
  if (sortBy === '가까운 순') sortedProducts.sort((a, b) => a.distance - b.distance);
  else if (sortBy === '할인율 높은 순') sortedProducts.sort((a, b) => b.discountRate - a.discountRate);
  else if (sortBy === '낮은 가격 순') sortedProducts.sort((a, b) => a.salePrice - b.salePrice);

  const newest = [...selling].reverse().slice(0, 6);

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>

      {/* ── 고정 헤더 ── */}
      <div style={{ background: colors.white, position: 'sticky', top: 0, zIndex: 20 }}>

        {/* 위치 + 알림 */}
        {!searchMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: colors.charcoalBlack }}>강남구 역삼동</span>
              <ChevronDown size={16} color={colors.charcoalBlack} />
            </button>
            <button onClick={onNotificationPress} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4 }}>
              <Bell size={22} color={colors.charcoalBlack} />
              <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: colors.alertRed, borderRadius: '50%', border: `2px solid ${colors.white}` }} />
            </button>
          </div>
        )}

        {/* 검색창 */}
        <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          {searchMode && (
            <button onClick={exitSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}>
              <ArrowLeft size={22} color={colors.charcoalBlack} />
            </button>
          )}
          <div style={{ flex: 1, background: colors.softGray, borderRadius: 12, display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 8 }}>
            <Search size={16} color={colors.mediumGray} />
            <input
              value={query}
              onFocus={() => setSearchMode(true)}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && query.trim()) saveSearch(query); }}
              placeholder="음식 또는 가게 검색"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: colors.charcoalBlack }}
            />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} color={colors.mediumGray} /></button>}
          </div>
          {searchMode && (
            <button onClick={() => setShowFilterSection(v => !v)} style={{ background: activeCount() > 0 ? colors.primaryGreen : colors.white, border: `1.5px solid ${activeCount() > 0 ? colors.primaryGreen : '#E8EAED'}`, borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <SlidersHorizontal size={16} color={activeCount() > 0 ? colors.white : colors.charcoalBlack} />
              {activeCount() > 0 && <span style={{ fontSize: 12, color: colors.white, fontWeight: 700 }}>{activeCount()}</span>}
            </button>
          )}
        </div>

        {/* 검색모드: 필터 패널 */}
        {searchMode && showFilterSection && (
          <div style={{ padding: '8px 16px 12px', borderTop: `1px solid ${colors.softGray}`, marginTop: 8 }}>
            {Object.entries({ ...FILTERS, category: ['빵', '도시락', '샐러드', '반찬', '디저트', '음료'] }).map(([group, options]) => (
              <div key={group} style={{ marginBottom: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: colors.mediumGray }}>{({ ...FILTER_LABELS, category: '카테고리' })[group]}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {options.map(opt => {
                    const active = (activeFilters[group] || []).includes(opt);
                    return <button key={opt} onClick={() => toggleFilter(group, opt)} style={{ background: active ? colors.freshMint : colors.softGray, color: active ? colors.primaryGreen : colors.charcoalBlack, border: `1.5px solid ${active ? colors.primaryGreen : 'transparent'}`, borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: active ? 700 : 400, cursor: 'pointer' }}>{opt}</button>;
                  })}
                </div>
              </div>
            ))}
            {activeCount() > 0 && <button onClick={() => setActiveFilters({})} style={{ background: 'none', border: `1px solid ${colors.mediumGray}`, borderRadius: 8, padding: '7px 14px', fontSize: 13, color: colors.mediumGray, cursor: 'pointer' }}>필터 초기화</button>}
          </div>
        )}

        {/* 검색모드: 결과 수 + 정렬 (쿼리가 있을 때만) */}
        {searchMode && query.trim() && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px 10px', borderTop: `1px solid ${colors.softGray}` }}>
            <span style={{ fontSize: 13, color: colors.mediumGray }}>
              상품 <strong style={{ color: colors.charcoalBlack }}>{sortedProducts.length}</strong> · 가게 <strong style={{ color: colors.charcoalBlack }}>{searchedStores.length}</strong>
            </span>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowSort(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: colors.charcoalBlack, fontWeight: 600 }}>
                {sortBy} <ChevronDown size={14} />
              </button>
              {showSort && (
                <div style={{ position: 'absolute', right: 0, top: 28, background: colors.white, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 50, minWidth: 150 }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }} style={{ display: 'block', width: '100%', padding: '11px 14px', background: sortBy === opt ? colors.freshMint : colors.white, border: 'none', cursor: 'pointer', fontSize: 13, color: sortBy === opt ? colors.primaryGreen : colors.charcoalBlack, fontWeight: sortBy === opt ? 700 : 400, textAlign: 'left' }}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!searchMode && <div style={{ height: 12 }} />}
      </div>

      {/* ── 검색 결과 / 추천 검색어 ── */}
      {searchMode ? (
        !query.trim() ? (
          /* 쿼리 없음 → 최근 검색 + 추천 검색어 */
          <div style={{ padding: '20px 16px 100px', background: colors.white, minHeight: '100%' }}>

            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>최근 검색어</p>
                  <button onClick={clearAllSearches} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: colors.mediumGray, padding: 0 }}>전체 삭제</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {recentSearches.map(kw => (
                    <div key={kw} style={{ display: 'flex', alignItems: 'center', background: colors.softGray, borderRadius: 20, padding: '7px 10px 7px 14px', gap: 6 }}>
                      <button onClick={() => applyKeyword(kw)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, color: colors.charcoalBlack, fontWeight: 500 }}>
                        {kw}
                      </button>
                      <button onClick={() => removeSearch(kw)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                        <X size={13} color={colors.mediumGray} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추천 검색어 */}
            <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>추천 검색어</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['크루아상', '샐러드', '도시락', '아메리카노', '샌드위치', '반찬세트', '베이글', '마감임박'].map(kw => (
                <button key={kw} onClick={() => applyKeyword(kw)} style={{
                  background: colors.softGray,
                  border: 'none', borderRadius: 20,
                  padding: '8px 16px',
                  fontSize: 14, color: colors.charcoalBlack,
                  cursor: 'pointer', fontWeight: 500,
                }}>
                  <Search size={12} color={colors.mediumGray} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {kw}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 쿼리 있음 → 검색 결과 */
          <div style={{ padding: '12px 16px 100px' }}>
            {searchedStores.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: colors.charcoalBlack }}>
                  🏪 가게 <span style={{ fontSize: 14, color: colors.mediumGray, fontWeight: 400 }}>{searchedStores.length}개</span>
                </p>
                {searchedStores.map(s => (
                  <div key={s.id} onClick={() => onStorePress && onStorePress(s.id)} style={{ background: colors.white, borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.freshMint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {s.name.includes('샐러드') ? '🥗' : s.name.includes('베이커리') || s.name.includes('바게뜨') ? '🥐' : s.name.includes('도시락') ? '🍱' : s.name.includes('반찬') ? '🥡' : s.name.includes('카페') ? '☕' : '🏪'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.charcoalBlack }}>{s.name}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: colors.mediumGray }}>{s.distance >= 1000 ? `${(s.distance/1000).toFixed(1)}km` : `${s.distance}m`} · 상품 {s.productCount}개 · 픽업 {s.pickupTime}</p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'selling' ? colors.primaryGreen : s.status === 'closing' ? colors.warmOrange : colors.mediumGray, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            )}
            {sortedProducts.length > 0 && (
              <div>
                <p style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: colors.charcoalBlack }}>
                  🍽 음식 <span style={{ fontSize: 14, color: colors.mediumGray, fontWeight: 400 }}>{sortedProducts.length}개</span>
                </p>
                {sortedProducts.map(p => <ProductCard key={p.id} product={p} onPress={onProductPress} onLike={onLike} onStorePress={onStorePress} />)}
              </div>
            )}
            {sortedProducts.length === 0 && searchedStores.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
                <p style={{ fontSize: 15, color: colors.mediumGray }}>검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        )

      ) : (
        /* ── 홈 본문 ── */
        <div style={{ paddingBottom: 100 }}>

          {/* 광고 배너 (검색바와 간격 확대) */}
          <div style={{ padding: '20px 16px 0' }}>
            <AdBanner onBannerPress={ad => {
              if (ad.linkType === 'category') {
                const cat = CATEGORIES.find(c => c.key === ad.linkValue) || CATEGORIES[0];
                setBrowseCategory(cat);
              }
            }} />
          </div>

          {/* 카테고리 아이콘 그리드 */}
          <div style={{ background: colors.white, margin: '16px 0 0', padding: '20px 16px 16px' }}>
            <CategoryGrid onSelect={cat => setBrowseCategory(cat)} />
          </div>

          {/* 내 주변 매장 */}
          <div style={{ marginTop: 12, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 16px 12px', background: colors.white }}>
              <div>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>내 주변 매장</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: colors.mediumGray }}>가까운 순으로 보기</p>
              </div>
              <button onClick={() => setShowStoreList(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontSize: 13, color: colors.primaryGreen, fontWeight: 600 }}>
                전체보기 <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: 16, paddingRight: 16, paddingBottom: 16, background: colors.white }}>
              {[...stores].sort((a, b) => a.distance - b.distance).map(s => (
                <StoreCard key={s.id} store={s} onClick={() => onStorePress && onStorePress(s.id)} />
              ))}
              <div style={{ flexShrink: 0, width: 4 }} />
            </div>
          </div>

          {/* 새로 등록된 상품 */}
          <div style={{ marginTop: 12, background: colors.white, padding: '18px 16px 20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>새로 등록된 상품</p>
            <p style={{ margin: '0 0 14px', fontSize: 13, color: colors.mediumGray }}>방금 막 올라왔어요</p>
            {newest.length === 0
              ? <div style={{ background: colors.softGray, borderRadius: 14, padding: 24, textAlign: 'center', color: colors.mediumGray, fontSize: 14 }}>등록된 상품이 없습니다</div>
              : newest.map(p => <ProductCard key={p.id} product={p} onPress={onProductPress} onLike={onLike} onStorePress={onStorePress} />)
            }
          </div>

        </div>
      )}
    </div>
  );
}
