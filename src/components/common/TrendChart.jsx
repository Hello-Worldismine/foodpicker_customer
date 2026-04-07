function TrendChart({ data = [] }) {
    const width = 280
    const height = 90
    const max = Math.max(...data)
    const min = Math.min(...data)
  
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((value - min) / (max - min || 1)) * (height - 10) - 5
        return `${x},${y}`
      })
      .join(' ')
  
    return (
      <div className="trend-chart-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart">
          <polyline
            fill="none"
            stroke="#ff4d4f"
            strokeWidth="3"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }
  
  export default TrendChart