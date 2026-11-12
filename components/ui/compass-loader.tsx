import React from "react";
import styles from "./compass-loader.module.css";

// Site palette: sage ring, cream ticks, warm-red needle
const RING = "#4A7244";
const RING_LIGHT = "#8EB486";
const TICK = "#E8DCD5";
const TICK_LIGHT = "#B8D1B2";
const NEEDLE = "#C94A3D";
const NEEDLE_LIGHT = "#E0786B";

const TICK_ANGLES = [-135, -90, -45, 0, 45, 90, 135, 180];

function Ticks({ color }: { color: string }) {
  return (
    <g strokeWidth={4} strokeDasharray="12 12" strokeDashoffset={12} strokeLinecap="round" transform="translate(80,80)">
      {TICK_ANGLES.map((angle) => (
        <polyline key={angle} className={styles.tick} stroke={color} points="0,2 0,14" transform={`rotate(${angle},0,0) translate(0,40)`} />
      ))}
    </g>
  );
}

function Ring({ color }: { color: string }) {
  return (
    <g className={styles.ringRotate}>
      <circle
        className={styles.ringStroke}
        cx={80}
        cy={80}
        r={72}
        fill="none"
        stroke={color}
        strokeWidth={16}
        strokeDasharray="452.39 452.39"
        strokeDashoffset={452}
        strokeLinecap="round"
        transform="rotate(-45,80,80)"
      />
    </g>
  );
}

function Needle({ north, south }: { north: string; south: string }) {
  return (
    <g transform="translate(64,28)">
      <g className={styles.arrows} transform="rotate(45,16,52)">
        <path
          fill={north}
          d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z"
        />
        <path
          fill={south}
          d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z"
        />
      </g>
    </g>
  );
}

let instance = 0;

/**
 * The site's loading indicator. `label` is read by screen readers and, when `showLabel`
 * is set, shown under the compass.
 */
export function CompassLoader({
  size = 96,
  label = "Loading",
  showLabel = false,
  className = "",
}: {
  size?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}) {
  // Mask ids must be unique when several loaders are on one page
  const id = React.useMemo(() => `pl${++instance}`, []);

  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <svg className={styles.pl} viewBox="0 0 160 160" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-grad`} x1={0} y1={0} x2={0} y2={1}>
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
          <mask id={`${id}-mask1`}>
            <rect x={0} y={0} width={160} height={160} fill={`url(#${id}-grad)`} />
          </mask>
          <mask id={`${id}-mask2`}>
            <rect x={28} y={28} width={104} height={104} fill={`url(#${id}-grad)`} />
          </mask>
        </defs>
        <g>
          <Ring color={RING} />
        </g>
        <g mask={`url(#${id}-mask1)`}>
          <Ring color={RING_LIGHT} />
        </g>
        <g>
          <Ticks color={TICK} />
        </g>
        <g mask={`url(#${id}-mask1)`}>
          <Ticks color={TICK_LIGHT} />
        </g>
        <g>
          <Needle north={NEEDLE} south={TICK} />
        </g>
        <g mask={`url(#${id}-mask2)`}>
          <Needle north={NEEDLE_LIGHT} south={TICK_LIGHT} />
        </g>
      </svg>
      {showLabel ? <p className="font-serif-italic text-lg text-[#685752]">{label}</p> : <span className="sr-only">{label}</span>}
    </div>
  );
}
