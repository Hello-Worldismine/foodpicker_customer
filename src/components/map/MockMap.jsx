function MockMap({ stores, selectedStoreId, onSelectStore }) {
    return (
      <div className="mock-map">
        <div className="map-radius">현재 위치 기준 반경 800m</div>
        <div className="map-center-pin">📍내 위치</div>
  
        {stores.map((store) => (
          <button
            key={store.id}
            className={`store-marker ${selectedStoreId === store.id ? 'selected' : ''} ${store.stockCount <= 2 ? 'low-stock' : ''}`}
            style={{ left: store.x, top: store.y }}
            onClick={() => onSelectStore(store)}
          >
            {store.stockCount}
          </button>
        ))}
      </div>
    )
  }
  
  export default MockMap