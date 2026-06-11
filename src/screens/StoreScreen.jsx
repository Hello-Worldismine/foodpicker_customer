import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Phone, Star, Share2, ChevronRight, Navigation } from 'lucide-react';
import { colors } from '../theme';
import ProductCard from '../components/ProductCard';
import { products } from '../mockData';

// 매장 상세 정보 (mockData 확장)
const storeDetails = {
  1: {
    id: 1,
    name: '그린샐러드 강남점',
    category: '샐러드·건강식',
    image: '🥗',
    address: '서울 강남구 테헤란로 123 1층',
    phone: '02-1234-5678',
    hours: '08:00 ~ 21:00',
    pickupHours: '18:00 ~ 20:00',
    rating: 4.8,
    reviewCount: 124,
    distance: 450,
    description: '매일 신선한 재료로 만드는 건강 샐러드 전문점입니다. 당일 소비기한 임박 상품을 합리적인 가격에 제공합니다.',
    notice: '픽업 시 영수증 또는 픽업번호를 보여주세요. 재고 소진 시 조기 마감될 수 있습니다.',
    tags: ['샐러드', '건강식', '다이어트', '비건'],
    lat: 37.5012,
    lng: 127.0396,
  },
  2: {
    id: 2,
    name: '베이커리온 역삼점',
    category: '베이커리',
    image: '🥐',
    address: '서울 강남구 역삼로 45 지하 1층',
    phone: '02-2345-6789',
    hours: '07:00 ~ 22:00',
    pickupHours: '17:00 ~ 21:00',
    rating: 4.6,
    reviewCount: 89,
    distance: 280,
    description: '매일 새벽 직접 구운 정통 프랑스 베이커리입니다. 당일 소비 권장 상품을 저렴하게 판매합니다.',
    notice: '재고 소진 시 조기 마감될 수 있습니다.',
    tags: ['빵', '크로와상', '바게트', '케이크'],
    lat: 37.5008,
    lng: 127.0368,
  },
  3: {
    id: 3,
    name: '한솥도시락 강남역점',
    category: '도시락·한식',
    image: '🍱',
    address: '서울 강남구 강남대로 396 2층',
    phone: '02-3456-7890',
    hours: '10:00 ~ 21:00',
    pickupHours: '16:00 ~ 19:00',
    rating: 4.4,
    reviewCount: 201,
    distance: 720,
    description: '국내산 재료로 만든 정성 가득 한식 도시락 전문점입니다.',
    notice: '',
    tags: ['도시락', '한식', '불고기', '비빔밥'],
    lat: 37.4979,
    lng: 127.0276,
  },
  4: {
    id: 4,
    name: '파리바게뜨 선릉점',
    category: '베이커리·카페',
    image: '🍰',
    address: '서울 강남구 선릉로 100',
    phone: '02-4567-8901',
    hours: '07:30 ~ 22:00',
    pickupHours: '19:00 ~ 21:30',
    rating: 4.5,
    reviewCount: 312,
    distance: 950,
    description: '신선한 베이커리와 음료를 함께 즐길 수 있는 카페형 베이커리입니다.',
    notice: '',
    tags: ['케이크', '빵', '음료', '디저트'],
    lat: 37.5044,
    lng: 127.0491,
  },
  5: {
    id: 5,
    name: '자연반찬 강남점',
    category: '반찬·가정식',
    image: '🥡',
    address: '서울 강남구 논현로 123',
    phone: '02-5678-9012',
    hours: '09:00 ~ 20:00',
    pickupHours: '17:00 ~ 20:00',
    rating: 4.7,
    reviewCount: 67,
    distance: 600,
    description: '국내산 재료만 사용하는 건강한 반찬 가게입니다. 당일 생산 상품을 당일 판매합니다.',
    notice: '반찬 특성상 픽업 후 냉장 보관 필수입니다.',
    tags: ['반찬', '나물', '두부', '가정식'],
    lat: 37.5021,
    lng: 127.0312,
  },
  6: {
    id: 6,
    name: '카페블랑 강남점',
    category: '카페·샌드위치',
    image: '☕',
    address: '서울 강남구 역삼로 12',
    phone: '02-6789-0123',
    hours: '08:00 ~ 21:00',
    pickupHours: '15:00 ~ 18:00',
    rating: 4.9,
    reviewCount: 188,
    distance: 330,
    description: '스페셜티 원두를 사용하는 프리미엄 카페입니다. 마감 시간 음료와 샌드위치를 할인 제공합니다.',
    notice: '음료는 픽업 시 제조됩니다.',
    tags: ['카페', '아메리카노', '샌드위치', '디저트'],
    lat: 37.4993,
    lng: 127.0348,
  },
};

export default function StoreScreen({ storeId, onBack, onProductPress, onLike, productList }) {
  const [activeTab, setActiveTab] = useState('products');
  const store = storeDetails[storeId];

  if (!store) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: colors.mediumGray }}>
        매장 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const storeProducts = productList.filter(p => p.storeId === storeId);
  const availableProducts = storeProducts.filter(
    p => p.status === 'selling' && p.stock > 0 && new Date(p.expiryDate) > new Date()
  );
  const soldoutProducts = storeProducts.filter(
    p => p.status === 'soldout' || p.stock === 0 || new Date(p.expiryDate) <= new Date()
  );

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* Header image area */}
      <div style={{
        background: `linear-gradient(135deg, #1A8F5A, ${colors.primaryGreen})`,
        padding: '0 0 24px',
        position: 'relative',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <ArrowLeft size={20} color={colors.white} />
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Share2 size={18} color={colors.white} />
          </button>
        </div>

        {/* Store identity */}
        <div style={{ padding: '8px 20px 0', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 72, height: 72, background: 'rgba(255,255,255,0.15)',
            borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.3)',
          }}>
            {store.image}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: colors.white }}>{store.name}</p>
            <p style={{ margin: '4px 0 6px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{store.category}</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '3px 9px' }}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <span style={{ fontSize: 13, color: colors.white, fontWeight: 700 }}>{store.rating}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>({store.reviewCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '3px 9px' }}>
                <MapPin size={11} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                  {store.distance >= 1000 ? `${(store.distance/1000).toFixed(1)}km` : `${store.distance}m`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background: colors.white, padding: '12px 16px', display: 'flex', gap: 8, marginBottom: 8 }}>
        <button style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          background: colors.freshMint, border: 'none', borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
        }}>
          <Navigation size={18} color={colors.primaryGreen} />
          <span style={{ fontSize: 12, color: colors.primaryGreen, fontWeight: 600 }}>길찾기</span>
        </button>
        <button style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          background: colors.softGray, border: 'none', borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
        }}>
          <Phone size={18} color={colors.charcoalBlack} />
          <span style={{ fontSize: 12, color: colors.charcoalBlack, fontWeight: 600 }}>전화</span>
        </button>
        <button style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          background: colors.softGray, border: 'none', borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
        }}>
          <Clock size={18} color={colors.charcoalBlack} />
          <span style={{ fontSize: 12, color: colors.charcoalBlack, fontWeight: 600 }}>영업시간</span>
        </button>
      </div>

      {/* Info card */}
      <div style={{ background: colors.white, padding: '14px 16px', marginBottom: 8 }}>
        {[
          { icon: <MapPin size={15} color={colors.mediumGray} />, label: '주소', value: store.address },
          { icon: <Phone size={15} color={colors.mediumGray} />, label: '전화', value: store.phone },
          { icon: <Clock size={15} color={colors.mediumGray} />, label: '영업시간', value: store.hours },
          { icon: <Clock size={15} color={colors.warmOrange} />, label: '픽업시간', value: store.pickupHours, highlight: true },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: `1px solid ${colors.softGray}` }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: colors.mediumGray, width: 52, flexShrink: 0 }}>{item.label}</span>
            <span style={{ fontSize: 13, color: item.highlight ? colors.warmOrange : colors.charcoalBlack, fontWeight: item.highlight ? 700 : 400 }}>
              {item.value}
            </span>
          </div>
        ))}
        {store.description && (
          <p style={{ margin: '10px 0 0', fontSize: 13, color: colors.mediumGray, lineHeight: 1.6 }}>{store.description}</p>
        )}
      </div>

      {/* Tags */}
      <div style={{ background: colors.white, padding: '10px 16px', marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {store.tags.map(tag => (
          <span key={tag} style={{
            background: colors.freshMint, color: colors.primaryGreen,
            fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
          }}>#{tag}</span>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background: colors.white, borderBottom: `2px solid ${colors.softGray}`, display: 'flex', marginBottom: 8 }}>
        {[
          { key: 'products', label: `판매 상품 ${availableProducts.length}개` },
          { key: 'info', label: '매장 정보' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, padding: '12px 0',
            background: 'none', border: 'none',
            borderBottom: `2.5px solid ${activeTab === t.key ? colors.primaryGreen : 'transparent'}`,
            marginBottom: -2,
            fontSize: 14, fontWeight: activeTab === t.key ? 800 : 400,
            color: activeTab === t.key ? colors.primaryGreen : colors.mediumGray,
            cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '0 16px 24px' }}>
        {activeTab === 'products' && (
          <>
            {availableProducts.length === 0 && soldoutProducts.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 40, color: colors.mediumGray }}>
                <p style={{ fontSize: 40, margin: '0 0 10px' }}>🛒</p>
                <p style={{ fontSize: 14 }}>현재 판매 중인 상품이 없습니다</p>
              </div>
            )}

            {availableProducts.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {availableProducts.map(p => (
                  <ProductCard key={p.id} product={p} onPress={onProductPress} onLike={onLike} />
                ))}
              </div>
            )}

            {soldoutProducts.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: colors.mediumGray }}>품절 / 판매 종료</p>
                {soldoutProducts.map(p => (
                  <ProductCard key={p.id} product={p} onPress={() => {}} onLike={onLike} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'info' && (
          <div style={{ marginTop: 12 }}>
            {store.notice && (
              <div style={{ background: '#FFF8E6', borderRadius: 12, padding: '14px', marginBottom: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: colors.warmOrange }}>📢 매장 공지</p>
                <p style={{ margin: 0, fontSize: 13, color: '#7A5C1E', lineHeight: 1.6 }}>{store.notice}</p>
              </div>
            )}

            {/* Pseudo map */}
            <div style={{ background: '#E8F4E8', borderRadius: 14, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '35%', left: 0, right: 0, height: 7, background: 'rgba(255,255,255,0.6)', borderRadius: 4 }} />
              <div style={{ position: 'absolute', left: '40%', top: 0, bottom: 0, width: 7, background: 'rgba(255,255,255,0.6)', borderRadius: 4 }} />
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ fontSize: 28 }}>📍</div>
                <div style={{ marginTop: 4, background: colors.primaryGreen, color: colors.white, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
                  {store.name}
                </div>
              </div>
            </div>

            <div style={{ background: colors.white, borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: colors.charcoalBlack }}>상세 주소</p>
              <p style={{ margin: 0, fontSize: 13, color: colors.mediumGray }}>{store.address}</p>
              <button style={{
                marginTop: 12, width: '100%', background: colors.freshMint, border: 'none',
                borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 700,
                color: colors.primaryGreen, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Navigation size={15} /> 길찾기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
