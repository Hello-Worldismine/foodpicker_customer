import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'
import MockMap from '../components/map/MockMap'
import { homePopularProducts } from '../data/mockData'

function MapPage({ stores, onPayNow }) {
  const [search, setSearch] = useState('')
  const [filter70, setFilter70] = useState(false)
  const [filterPickup, setFilterPickup] = useState(false)
  const [selectedStore, setSelectedStore] = useState(stores[0] ?? null)

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const keyword = search.trim().toLowerCase()

      const matchesSearch =
        keyword === '' ||
        store.name.toLowerCase().includes(keyword) ||
        store.region.toLowerCase().includes(keyword)

      const matches70 = filter70 ? store.highlight70 : true
      const matchesPickup = filterPickup ? store.pickupNow : true

      return matchesSearch && matches70 && matchesPickup
    })
  }, [stores, search, filter70, filterPickup])

  useEffect(() => {
    if (!selectedStore && filteredStores.length > 0) {
      setSelectedStore(filteredStores[0])
      return
    }

    if (
      selectedStore &&
      !filteredStores.some((store) => store.id === selectedStore.id)
    ) {
      setSelectedStore(filteredStores[0] ?? null)
    }
  }, [filteredStores, selectedStore])

  const selectedStoreItems = useMemo(() => {
    if (!selectedStore) return []

    return homePopularProducts
      .filter((product) => product.storeId === selectedStore.id)
      .map((product) => ({
        ...product,
        price: product.currentPrice,
        store: selectedStore.name,
        address: selectedStore.address,
        contact: selectedStore.contact,
      }))
  }, [selectedStore])

  return (
    <div className="page">
      <PageHeader title="지도" />

      <div className="search-box">
        <input
          className="text-input"
          placeholder="매장명 또는 지역 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <button
          className={`chip-button ${filter70 ? 'active' : ''}`}
          onClick={() => setFilter70((prev) => !prev)}
        >
          70% 할인만 보기
        </button>
        <button
          className={`chip-button ${filterPickup ? 'active' : ''}`}
          onClick={() => setFilterPickup((prev) => !prev)}
        >
          지금 바로 픽업 가능
        </button>
      </div>

      <SectionCard>
        <MockMap
          stores={filteredStores}
          selectedStoreId={selectedStore?.id}
          onSelectStore={setSelectedStore}
        />
      </SectionCard>

      {selectedStore && (
        <SectionCard>
          <div className="store-summary-card">
  <div className="store-summary-top">
    <div className="store-summary-title-wrap">
      <span className="store-summary-label">선택한 가게</span>
      <h3>{selectedStore.name}</h3>
      <p>{selectedStore.region}</p>
    </div>

    <div className={`store-stock-badge ${selectedStore.stockCount <= 2 ? 'low' : ''}`}>
      잔여 {selectedStore.stockCount}개
    </div>
  </div>

  <div className="store-summary-highlight">
    <div className="store-summary-highlight-item">
      <span className="store-summary-mini-label">최고 할인 상품</span>
      <strong>{selectedStore.topProduct}</strong>
    </div>

    <div className="store-summary-discount-chip">
      {selectedStore.bestDiscount > 0 ? `${selectedStore.bestDiscount}% 할인` : '할인 정보 없음'}
    </div>
  </div>
</div>

          <div className="store-item-table">
            <div className="store-item-head">
              <span>상품</span>
              <span>현재가</span>
              <span>결제</span>
            </div>

            {selectedStoreItems.length === 0 ? (
              <div className="store-empty-row">현재 판매중인 상품이 없습니다.</div>
            ) : (
              selectedStoreItems.map((item) => (
                <div key={item.id} className="store-item-row">
                  <div className="store-item-product">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                  <span>{item.currentPrice.toLocaleString()}원</span>
                  <button
                    className="small-primary-button"
                    onClick={() => onPayNow(item)}
                  >
                    결제
                  </button>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      )}
    </div>
  )
}

export default MapPage