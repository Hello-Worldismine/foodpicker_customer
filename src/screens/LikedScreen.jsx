import { Heart } from 'lucide-react';
import { colors } from '../theme';
import ProductCard from '../components/ProductCard';

export default function LikedScreen({ productList, onProductPress, onStorePress, onLike }) {
  const likedProducts = productList.filter(p => p.liked);

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: colors.white, padding: '18px 16px 14px', position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${colors.softGray}` }}>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: colors.charcoalBlack }}>찜한 상품</p>
        {likedProducts.length > 0 && (
          <p style={{ margin: '3px 0 0', fontSize: 13, color: colors.mediumGray }}>
            총 <strong style={{ color: colors.primaryGreen }}>{likedProducts.length}개</strong>의 상품을 찜했어요
          </p>
        )}
      </div>

      <div style={{ padding: '12px 16px 100px' }}>
        {likedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: colors.softGray,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Heart size={32} color={colors.mediumGray} />
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: colors.charcoalBlack }}>찜한 상품이 없어요</p>
            <p style={{ margin: 0, fontSize: 14, color: colors.mediumGray }}>
              마음에 드는 상품의 ♡를 눌러<br />찜 목록에 추가해보세요
            </p>
          </div>
        ) : (
          likedProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={onProductPress}
              onLike={onLike}
              onStorePress={onStorePress}
            />
          ))
        )}
      </div>
    </div>
  );
}
