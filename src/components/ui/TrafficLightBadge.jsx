import React from 'react'
import { getLightConfig } from '../../utils/trafficLight'

export default function TrafficLightBadge({ light, size = 'sm' }) {
  const cfg = getLightConfig(light)
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${cfg.tailwind} ${sizeClass}`}>
      {cfg.label}
    </span>
  )
}

export function TrafficDot({ light, size = 8 }) {
  const cfg = getLightConfig(light)
  return (
    <span
      className={`inline-block rounded-full flex-shrink-0 ${cfg.dot}`}
      style={{ width: size, height: size }}
    />
  )
}
