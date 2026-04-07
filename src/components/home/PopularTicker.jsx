import { useEffect, useState } from 'react'

function PopularTicker({ items }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 2200)

    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="popular-ticker">
      <span className="ticker-badge">실시간 인기 제품</span>
      <span className="ticker-text">
        {index + 1}위 · {items[index].name}
      </span>
    </div>
  )
}

export default PopularTicker