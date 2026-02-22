"use client"

import { useId, useMemo } from "react"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  positive: boolean
}

export function Sparkline({ data, width = 80, height = 32, positive }: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return ""
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const padding = 2
    const stepX = (width - padding * 2) / (data.length - 1)

    const points = data.map((value, index) => ({
      x: padding + index * stepX,
      y: padding + (1 - (value - min) / range) * (height - padding * 2),
    }))

    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx1 = prev.x + (curr.x - prev.x) / 3
      const cpy1 = prev.y
      const cpx2 = curr.x - (curr.x - prev.x) / 3
      const cpy2 = curr.y
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`
    }
    return d
  }, [data, width, height])

  const reactId = useId()
  const gradientId = `sparkline-gradient-${reactId.replace(/:/g, "")}`
  const fillPath = useMemo(() => {
    if (!path) return ""
    return `${path} L ${width - 2} ${height} L 2 ${height} Z`
  }, [path, width, height])

  const strokeColor = positive ? "var(--finverse-bull)" : "var(--finverse-bear)"
  const fillColor = positive ? "var(--finverse-bull)" : "var(--finverse-bear)"

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path d={path} stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
