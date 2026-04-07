function TrendChart({ data = [] }) {
  const width = 320
  const height = 120
  const chartTop = 16
  const chartBottom = 82
  const min = Math.min(...data.map((item) => item.price))
  const max = Math.max(...data.map((item) => item.price))

  const getX = (index) => {
    if (data.length === 1) return width / 2
    return 20 + (index / (data.length - 1)) * (width - 40)
  }

  const getY = (price) => {
    return chartBottom - ((price - min) / (max - min || 1)) * (chartBottom - chartTop)
  }

  const points = data
    .map((item, index) => `${getX(index)},${getY(item.price)}`)
    .join(' ')

  return (
    <div className="trend-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart">
        {[0, 1, 2].map((line) => {
          const y = chartTop + ((chartBottom - chartTop) / 2) * line
          return (
            <line
              key={line}
              x1="16"
              y1={y}
              x2={width - 16}
              y2={y}
              stroke="#eceef3"
              strokeDasharray="4 4"
            />
          )
        })}

        <polyline
          fill="none"
          stroke="#ff4d4f"
          strokeWidth="3"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => {
          const x = getX(index)
          const y = getY(item.price)

          return (
            <g key={`${item.time}-${item.price}`}>
              <circle cx={x} cy={y} r="4.5" fill="#ff4d4f" />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#ff4d4f"
                fontWeight="700"
              >
                {item.price.toLocaleString()}
              </text>
              <text
                x={x}
                y="104"
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {item.time}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default TrendChart