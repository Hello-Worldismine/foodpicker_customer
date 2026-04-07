export const homePopularProducts = [
    {
      id: 1,
      category: '빵/디저트',
      name: '딸기 생크림 케이크 조각',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
      originalPrice: 8900,
      currentPrice: 3900,
      startPrice: 7900,
      discountRate: 56,
      dropAmount: 5000,
      pickupTime: '오늘 18:30 ~ 20:00',
      trend: [7900, 7200, 6500, 5900, 4900, 3900],
      store: '달콤 베이커리 상수점',
    },
    {
      id: 2,
      category: '마트',
      name: '과일 샐러드 컵',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
      originalPrice: 6500,
      currentPrice: 2800,
      startPrice: 5500,
      discountRate: 57,
      dropAmount: 3700,
      pickupTime: '오늘 19:00 ~ 21:00',
      trend: [5500, 5200, 4800, 4300, 3600, 2800],
      store: '굿마트 홍대점',
    },
    {
      id: 3,
      category: '식당',
      name: '수제 돈까스 도시락',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
      originalPrice: 12000,
      currentPrice: 4900,
      startPrice: 9900,
      discountRate: 59,
      dropAmount: 7100,
      pickupTime: '오늘 17:40 ~ 19:10',
      trend: [9900, 9200, 8400, 7600, 6200, 4900],
      store: '오늘한끼 연남점',
    },
  ]
  
export const categories = [
  { id: 1, name: '빵/디저트', icon: '🥐' },
  { id: 2, name: '반찬가게', icon: '🥗' },
  { id: 3, name: '마트', icon: '🛍' },
  { id: 4, name: '전통시장', icon: '🏬' },
  { id: 5, name: '야채가게', icon: '🥦' },
  { id: 6, name: '육류/어류', icon: '🍖' },
  { id: 7, name: '식당', icon: '🍽' },
  { id: 8, name: '편의점', icon: '🏪' },
  { id: 9, name: '70%할인상품(마감임박)', icon: '⚡' },
  { id: 10, name: '초긴급(마감30분전)', icon: '⏰' },
]
  
  export const stores = [
    {
      id: 1,
      name: '굿마트 홍대점',
      region: '서교동',
      x: '28%',
      y: '32%',
      stockCount: 8,
      highlight70: true,
      pickupNow: true,
      bestDiscount: 70,
      topProduct: '과일 샐러드 컵',
      items: [
        {
          id: 101,
          name: '과일 샐러드 컵',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
          price: 2800,
        },
        {
          id: 102,
          name: '훈제 닭가슴살 샐러드',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
          price: 3200,
        },
      ],
    },
    {
      id: 2,
      name: '달콤 베이커리 상수점',
      region: '상수동',
      x: '62%',
      y: '24%',
      stockCount: 2,
      highlight70: false,
      pickupNow: true,
      bestDiscount: 56,
      topProduct: '딸기 생크림 케이크 조각',
      items: [
        {
          id: 103,
          name: '딸기 생크림 케이크 조각',
          image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
          price: 3900,
        },
      ],
    },
    {
      id: 3,
      name: '오늘한끼 연남점',
      region: '연남동',
      x: '70%',
      y: '68%',
      stockCount: 12,
      highlight70: true,
      pickupNow: false,
      bestDiscount: 59,
      topProduct: '수제 돈까스 도시락',
      items: [
        {
          id: 104,
          name: '수제 돈까스 도시락',
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
          price: 4900,
        },
        {
          id: 105,
          name: '치킨마요 덮밥',
          image: 'https://images.unsplash.com/photo-1604908176997-4317c6a7d2d8?q=80&w=800&auto=format&fit=crop',
          price: 4500,
        },
      ],
    },
  ]
  
  export const favoriteItems = [
    {
      id: 1,
      name: '딸기 생크림 케이크 조각',
      store: '달콤 베이커리 상수점',
      price: 3900,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
      address: '서울 마포구 상수동 00-1',
      contact: '02-123-4567',
    },
    {
      id: 2,
      name: '과일 샐러드 컵',
      store: '굿마트 홍대점',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
      address: '서울 마포구 서교동 11-2',
      contact: '02-987-6543',
    },
  ]
  
  export const pickupOrders = [
    {
      id: 1,
      name: '과일 샐러드 컵',
      quantity: 2,
      store: '굿마트 홍대점',
      code: 'FP-2108',
      address: '서울 마포구 서교동 11-2',
      contact: '02-987-6543',
    },
    {
      id: 2,
      name: '수제 돈까스 도시락',
      quantity: 1,
      store: '오늘한끼 연남점',
      code: 'FP-7321',
      address: '서울 마포구 연남동 20-4',
      contact: '02-555-1234',
    },
  ]
  
  export const myOrders = [
    {
      id: 1,
      orderNumber: '2026-0407-001',
      orderDate: '2026.04.07 14:25',
      name: '과일 샐러드 컵',
      store: '굿마트 홍대점',
      address: '서울 마포구 서교동 11-2',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
      price: 2800,
      status: '픽업대기',
    },
    {
      id: 2,
      orderNumber: '2026-0406-003',
      orderDate: '2026.04.06 18:40',
      name: '딸기 생크림 케이크 조각',
      store: '달콤 베이커리 상수점',
      address: '서울 마포구 상수동 00-1',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
      price: 3900,
      status: '픽업 완료',
      pickedUpAt: '2026.04.06 19:12',
    },
  ]
  
  export const currentLocation = '서교동'
  export const bannerTexts = [
    '마감임박 상품 최대 70% 할인',
    '지금 예약하고 퇴근길에 바로 픽업',
    '폐기 줄이고 할인은 크게, 푸드피커',
  ]