import { useState } from 'react';
import { Search, Navigation, X, ChevronRight } from 'lucide-react';
import { colors } from '../theme';
import { stores, products } from '../mockData';

const categories = ['전체', '빵', '도시락', '샐러드', '반찬', '디저트', '음료'];

const pinColors = {
  selling: colors.primaryGreen,
  closing: colors.warmOrange,
  soldout: colors.mediumGray,
};

// Simple pseudo-map using absolute positioning
function PseudoMap({ stores, selectedStore, onPinPress }) {
  // Map bounds: lat 37.495~37.508, lng 127.024~127.053
  const minLat = 37.495, maxLat = 37.508;
  const minLng = 127.024, maxLng = 127.053;

  function toXY(lat, lng, w, h) {
    const x = ((lng - minLng) / (maxLng - minLng)) * w;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * h;
    return { x, y };
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#E8F4E8', overflow: 'hidden' }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <div key={`h${f}`} style={{ position: 'absolute', top: `${f * 100}%`, left: 0, right: 0, height: 1, background: 'rgba(34,160,107,0.12)' }} />
      ))}
      {[0.25, 0.5, 0.75].map(f => (
        <div key={`v${f}`} style={{ position: 'absolute', left: `${f * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(34,160,107,0.12)' }} />
      ))}
      {/* Roads */}
      <div style={{ position: 'absolute', top: '42%', left: 0, right: 0, height: 8, background: 'rgba(255,255,255,0.6)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: '35%', top: 0, bottom: 0, width: 8, background: 'rgba(255,255,255,0.6)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: '65%', top: 0, bottom: 0, width: 8, background: 'rgba(255,255,255,0.6)', borderRadius: 4 }} />

      {/* Current location */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 16,
        height: 16,
        background: '#4A90D9',
        borderRadius: '50%',
        border: '3px solid white',
        boxShadow: '0 0 0 8px rgba(74,144,217,0.2)',
        zIndex: 5,
      }} />

      {/* Store pins */}
      {stores.map(store => {
        const { x, y } = toXY(store.lat, store.lng, 100, 100);
        const selected = selectedStore?.id === store.id;
        const pColor = pinColors[store.status] || colors.primaryGreen;
        return (
          <button
            key={store.id}
            onClick={() => onPinPress(store)}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -100%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: selected ? 10 : 5,
            }}
          >
            <div style={{
              background: pColor,
              color: colors.white,
              borderRadius: 10,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: selected ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.15)',
              border: selected ? `2px solid ${colors.white}` : '2px solid transparent',
              transform: selected ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.2s',
            }}>
              {store.name.split(' ')[0]}
            </div>
            <div style={{
              width: 0, height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `6px solid ${pColor}`,
              margin: '0 auto',
            }} />
          </button>
        );
      })}
    </div>
  );
}

export default function MapScreen({ onProductPress, onStorePress }) {
  const [selCat, setSelCat] = useState('전체');
  const [selectedStore, setSelectedStore] = useState(null);

  const filteredStores = selCat === '전체'
    ? stores
    : stores.filter(s => {
        const storeProducts = products.filter(p => p.storeId === s.id);
        return storeProducts.some(p => p.category === selCat);
      });

  const storeProducts = selectedStore
    ? products.filter(p => p.storeId === selectedStore.id && p.status === 'selling' && p.stock > 0)
    : [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 0', background: colors.white, zIndex: 20 }}>
        <div style={{
          background: colors.softGray,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          gap: 8,
          marginBottom: 10,
        }}>
          <Search size={16} color={colors.mediumGray} />
          <span style={{ fontSize: 14, color: colors.mediumGray }}>매장 또는 상품 검색</span>
        </div>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setSelCat(c)} style={{
              flexShrink: 0,
              background: selCat === c ? colors.primaryGreen : colors.white,
              color: selCat === c ? colors.white : colors.charcoalBlack,
              border: `1.5px solid ${selCat === c ? colors.primaryGreen : '#E8EAED'}`,
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: selCat === c ? 700 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '6px 16px', display: 'flex', gap: 14, background: colors.white }}>
        {[
          { color: colors.primaryGreen, label: '판매중' },
          { color: colors.warmOrange, label: '마감임박' },
          { color: colors.mediumGray, label: '품절' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: 12, color: colors.mediumGray }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onClick={() => selectedStore && setSelectedStore(null)}
      >
        <PseudoMap stores={filteredStores} selectedStore={selectedStore} onPinPress={store => {
          setSelectedStore(store);
        }} />

        {/* Current location button */}
        <button style={{
          position: 'absolute',
          right: 16,
          bottom: selectedStore ? 190 : 20,
          width: 44,
          height: 44,
          background: colors.white,
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'bottom 0.3s',
          zIndex: 10,
        }}>
          <Navigation size={20} color={colors.primaryGreen} />
        </button>
      </div>

      {/* Store mini card */}
      {selectedStore && (
        <div style={{
          position: 'absolute',
          bottom: 64,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 398,
          background: colors.white,
          borderRadius: 20,
          padding: '16px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
          zIndex: 50,
        }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: colors.charcoalBlack }}>{selectedStore.name}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.mediumGray }}>
                남은 상품 {selectedStore.productCount}개 · {selectedStore.distance >= 1000 ? `${(selectedStore.distance/1000).toFixed(1)}km` : `${selectedStore.distance}m`}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.charcoalBlack }}>
                픽업 가능 {selectedStore.pickupTime}
              </p>
            </div>
            <button onClick={() => setSelectedStore(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={20} color={colors.mediumGray} />
            </button>
          </div>
          {/* Product previews */}
          {storeProducts.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {storeProducts.slice(0, 3).map(p => (
                <div key={p.id} onClick={() => onProductPress(p)} style={{
                  flexShrink: 0,
                  background: colors.softGray,
                  borderRadius: 10,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  minWidth: 110,
                }}>
                  <span style={{ fontSize: 22 }}>{p.images[0]}</span>
                  <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: colors.charcoalBlack }}>{p.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 800, color: colors.primaryGreen }}>{p.salePrice.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => onStorePress && onStorePress(selectedStore.id)}
            style={{
            marginTop: 12,
            width: '100%',
            background: colors.primaryGreen,
            color: colors.white,
            border: 'none',
            borderRadius: 12,
            padding: '13px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}>
            상품 보기 <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
