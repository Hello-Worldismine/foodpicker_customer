import { useState, useRef } from 'react';
import { ArrowLeft, Star, Camera, X, CheckCircle } from 'lucide-react';
import { colors } from '../theme';

const MAX_PHOTOS = 5;
const MIN_TEXT  = 10;
const MAX_TEXT  = 300;

// ─── 별점 선택 컴포넌트 ───────────────────────────────────
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  const LABELS = ['', '별로예요', '그저 그래요', '괜찮아요', '좋아요', '최고예요!'];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
          >
            <Star
              size={38}
              color={n <= display ? '#FBBF24' : '#D1D5DB'}
              fill={n <= display ? '#FBBF24' : 'none'}
              style={{ transition: 'all 0.1s' }}
            />
          </button>
        ))}
      </div>
      <p style={{
        margin: 0,
        fontSize: 14, fontWeight: 700,
        color: value ? '#FBBF24' : colors.mediumGray,
        minHeight: 20,
      }}>
        {LABELS[display] || '별점을 선택해주세요'}
      </p>
    </div>
  );
}

// ─── 사진 썸네일 ─────────────────────────────────────────
function PhotoThumb({ url, onRemove }) {
  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <img
        src={url}
        alt="리뷰 사진"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
      />
      <button
        onClick={onRemove}
        style={{
          position: 'absolute', top: -6, right: -6,
          width: 20, height: 20, borderRadius: '50%',
          background: colors.charcoalBlack, border: 'none',
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={11} color={colors.white} />
      </button>
    </div>
  );
}

// ─── 완료 화면 ──────────────────────────────────────────
function SuccessView({ onBack }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px', textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: colors.freshMint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <CheckCircle size={42} color={colors.primaryGreen} />
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900, color: colors.charcoalBlack }}>
        리뷰가 등록되었어요!
      </p>
      <p style={{ margin: '0 0 32px', fontSize: 14, color: colors.mediumGray, lineHeight: 1.6 }}>
        소중한 리뷰 감사합니다.<br />사장님과 다른 고객들에게 도움이 돼요 🙌
      </p>
      <button
        onClick={onBack}
        style={{
          width: '100%', padding: '15px',
          background: colors.primaryGreen, color: colors.white,
          border: 'none', borderRadius: 14,
          fontSize: 16, fontWeight: 700, cursor: 'pointer',
        }}
      >
        확인
      </button>
    </div>
  );
}

// ─── 메인 화면 ──────────────────────────────────────────
export default function WriteReviewScreen({ order, onBack }) {
  const [rating, setRating]     = useState(0);
  const [text, setText]         = useState('');
  const [photos, setPhotos]     = useState([]);   // { id, url }[]
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const canSubmit = rating > 0 && text.trim().length >= MIN_TEXT;

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...toAdd]);
    e.target.value = '';
  }

  function removePhoto(id) {
    setPhotos(prev => {
      const removed = prev.find(p => p.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter(p => p.id !== id);
    });
  }

  function handleSubmit() {
    if (!canSubmit) return;
    // 실제 서버 전송 시 여기서 API 호출
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: colors.white }}>
        {/* 헤더 */}
        <div style={{
          background: colors.white,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${colors.softGray}`,
        }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={22} color={colors.charcoalBlack} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>리뷰 쓰기</span>
        </div>
        <SuccessView onBack={onBack} />
      </div>
    );
  }

  return (
    <div style={{ background: colors.softGray, minHeight: '100%' }}>
      {/* 헤더 */}
      <div style={{
        background: colors.white,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: `1px solid ${colors.softGray}`,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} color={colors.charcoalBlack} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: colors.charcoalBlack }}>리뷰 쓰기</span>
      </div>

      {/* 주문 요약 카드 */}
      <div style={{
        background: colors.white,
        margin: '8px 16px',
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: colors.freshMint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          🛍️
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 15, fontWeight: 800, color: colors.charcoalBlack,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {order?.productName}
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: colors.mediumGray }}>
            {order?.store} · {order?.pickupTime}
          </p>
        </div>
      </div>

      {/* 별점 */}
      <div style={{
        background: colors.white,
        margin: '8px 16px',
        borderRadius: 14,
        padding: '20px 16px',
      }}>
        <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: colors.charcoalBlack, textAlign: 'center' }}>
          이번 주문은 어떠셨나요?
        </p>
        <StarSelector value={rating} onChange={setRating} />
      </div>

      {/* 사진 업로드 */}
      <div style={{
        background: colors.white,
        margin: '8px 16px',
        borderRadius: 14,
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: colors.charcoalBlack }}>
            사진 첨부
          </p>
          <span style={{ fontSize: 12, color: colors.mediumGray }}>
            {photos.length}/{MAX_PHOTOS}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* 추가 버튼 */}
          {photos.length < MAX_PHOTOS && (
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: 72, height: 72, flexShrink: 0,
                border: `2px dashed ${colors.mediumGray}`,
                borderRadius: 10,
                background: colors.softGray,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', gap: 4,
              }}
            >
              <Camera size={20} color={colors.mediumGray} />
              <span style={{ fontSize: 10, color: colors.mediumGray }}>사진 추가</span>
            </button>
          )}

          {/* 미리보기 썸네일 */}
          {photos.map(p => (
            <PhotoThumb key={p.id} url={p.url} onRemove={() => removePhoto(p.id)} />
          ))}
        </div>

        {/* 안내 문구 */}
        <p style={{ margin: '10px 0 0', fontSize: 11, color: colors.mediumGray }}>
          최대 {MAX_PHOTOS}장까지 첨부 가능합니다. 음식 사진을 올려주세요 📸
        </p>

        {/* 숨김 파일 입력 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* 리뷰 텍스트 */}
      <div style={{
        background: colors.white,
        margin: '8px 16px',
        borderRadius: 14,
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: colors.charcoalBlack }}>
            리뷰 작성
          </p>
          <span style={{
            fontSize: 12,
            color: text.length < MIN_TEXT ? colors.mediumGray : colors.primaryGreen,
            fontWeight: text.length >= MIN_TEXT ? 700 : 400,
          }}>
            {text.length}/{MAX_TEXT}
          </span>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_TEXT))}
          placeholder={`음식 맛, 포장 상태, 픽업 경험 등을 자유롭게 작성해주세요.\n(최소 ${MIN_TEXT}자)`}
          rows={5}
          style={{
            width: '100%',
            padding: '12px',
            border: `1.5px solid ${text.length > 0 && text.length < MIN_TEXT ? colors.alertRed : colors.softGray}`,
            borderRadius: 10,
            fontSize: 14,
            lineHeight: 1.6,
            resize: 'none',
            outline: 'none',
            color: colors.charcoalBlack,
            background: colors.softGray,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />

        {text.length > 0 && text.length < MIN_TEXT && (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: colors.alertRed }}>
            최소 {MIN_TEXT}자 이상 작성해주세요. ({MIN_TEXT - text.length}자 더 필요)
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <div style={{ padding: '8px 16px 40px' }}>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '15px',
            background: canSubmit ? colors.primaryGreen : '#C8CDD3',
            color: colors.white,
            border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'default',
            transition: 'background 0.2s',
          }}
        >
          리뷰 등록하기
        </button>
      </div>
    </div>
  );
}
