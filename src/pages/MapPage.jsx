import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'
import MockMap from '../components/map/MockMap'

function MapPage({ stores, onPayNow }) {
  const [search, setSearch] = useState('')
  const [filter70, setFilter70] = useState(false)
  const [filterPickup, setFilterPickup] = useState(false)
  const [selectedStore, setSelectedStore] = useState(stores[0])

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch =
        store.name.includes(search) || store.region.includes(search)

      const matches70 = filter70 ? store.highlight70 : true
      const matchesPickup = filterPickup ? store.pickupNow : true

      return matchesSearch && matches70 && matchesPickup
    })
  }, [stores, search, filter70, filterPickup])

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
          <div className="store-summary">
            <h3>{selectedStore.name}</h3>
            <p>최고 할인 상품 : {selectedStore.topProduct} ({selectedStore.bestDiscount}%)</p>
            <p>잔여 수량 : {selectedStore.stockCount}개</p>
          </div>

          <div className="store-item-table">
            <div className="store-item-head">
              <span>상품</span>
              <span>현재가</span>
              <span>결제</span>
            </div>

            {selectedStore.items.map((item) => (
              <div key={item.id} className="store-item-row">
                <div className="store-item-product">
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                </div>
                <span>{item.price.toLocaleString()}원</span>
                <button
                  className="small-primary-button"
                  onClick={() =>
                    onPayNow({
                      ...item,
                      store: selectedStore.name,
                      currentPrice: item.price,
                    })
                  }
                >
                  결제
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}

export default MapPage