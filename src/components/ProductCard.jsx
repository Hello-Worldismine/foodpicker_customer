import { Heart, Clock } from 'lucide-react';
import { colors } from '../theme';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
}

const badgeColors = {
  '마감임박': { bg: '#FFF3E8', color: colors.warmOrange },
  '오늘까지': { bg: '#FFF3E8', color: colors.warmOrange },
  '오늘픽업': { bg: colors.freshMint, color: colors.primaryGreen },
  '품절': { bg: colors.softGray, color: colors.mediumGray },
  default: { bg: colors.freshMint, color: colors.primaryGreen },
};

export default function ProductCard({ product, onPress, onLike, onStorePress }) {
  const isSoldout = product.status === 'soldout' || product.stock === 0;
  const isExpired = new Date(product.expiryDate) < new Date();
  const isPickupEnded = new Date(product.pickupEnd) < new Date();
  const unavailable = isSoldout || isExpired || isPickupEnded;

  return (
    <div
      role="button"
      tabIndex={unavailable ? -1 : 0}
      onClick={() => !unavailable && onPress(product)}
      onKeyDown={e => e.key === 'Enter' && !unavailable && onPress(product)}
      style={{
        background: colors.white,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        cursor: unavailable ? 'default' : 'pointer',
        opacity: unavailable ? 0.65 : 1,
        position: 'relative',
        marginBottom: 12,
      }}
    >
      {/* Image */}
      <div style={{
        height: 140,
        background: colors.softGray,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 56,
        position: 'relative',
      }}>
        {product.images[0]}
        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {product.badges.map(b => {
            const s = badgeColors[b] || badgeColors.default;
            return (
              <span key={b} style={{
                background: s.bg,
                color: s.color,
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: 6,
              }}>{b}</span>
            );
          })}
        </div>
        {/* Discount badge */}
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: colors.primaryGreen,
          color: colors.white,
          fontSize: 13,
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: 8,
        }}>
          -{product.discountRate}%
        </div>
        {/* Like button */}
        <button
          onClick={e => { e.stopPropagation(); onLike && onLike(product.id); }}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Heart
            size={16}
            fill={product.liked ? colors.alertRed : 'none'}
            color={product.liked ? colors.alertRed : colors.mediumGray}
            strokeWidth={2}
          />
        </button>
      </div>
      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.charcoalBlack }}>{product.name}</p>
        <button
          onClick={e => { e.stopPropagation(); onStorePress && onStorePress(product.storeId); }}
          style={{ background: 'none', border: 'none', padding: '2px 0 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          <span style={{ fontSize: 12, color: colors.mediumGray }}>{product.store}</span>
          <span style={{ fontSize: 12, color: colors.mediumGray }}>·</span>
          <span style={{ fontSize: 12, color: colors.mediumGray }}>{formatDistance(product.distance)}</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: colors.mediumGray, textDecoration: 'line-through' }}>
            {product.originalPrice.toLocaleString()}원
          </span>
          <span style={{ fontSize: 17, fontWeight: 800, color: colors.primaryGreen }}>
            {product.salePrice.toLocaleString()}원
          </span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: isSoldout ? colors.alertRed : colors.mediumGray, fontWeight: isSoldout ? 700 : 400 }}>
            {isSoldout ? '품절' : `남은 수량 ${product.stock}개`}
          </span>
          <span style={{ fontSize: 12, color: colors.charcoalBlack, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={12} color={colors.warmOrange} />
            픽업 {formatTime(product.pickupStart)}~{formatTime(product.pickupEnd)}
          </span>
        </div>
      </div>
    </div>
  );
}
