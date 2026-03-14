import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum, percent } from "../helpers";

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start[0]} ${start[1]} A ${r} ${r} 0 ${large} 0 ${end[0]} ${end[1]}`;
}

export const Gauge = defineComponent({
  name: "Gauge",
  props: z.object({
    label: z.string().describe("Gauge label text."),
    value: z.number().describe("Current value."),
    max: z.number().default(100).describe("Maximum value. Defaults to 100."),
    unit: z.string().default("%").describe("Unit suffix. Defaults to %."),
    size: z.number().default(UI.gauge.defaultSize).describe(`Gauge diameter in pixels. Defaults to ${UI.gauge.defaultSize}.`),
    color: colorEnum.default("accent").describe("Arc fill color. Defaults to accent."),
  }),
  description: "Arc gauge showing value/max.",
  component: ({ props }) => {
    const max = props.max ?? 100;
    const pct = percent(props.value, max);
    const display = max === 100 ? String(Math.round(props.value)) : `${props.value}/${max}`;
    const unit = props.unit ?? "%";
    const size = props.size ?? UI.gauge.defaultSize;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - UI.gauge.stroke;
    const sweep = Math.min(pct, 100) * UI.gauge.arcSweep;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ position: "absolute" }}>
          <path d={describeArc(cx, cy, r, UI.gauge.arcStart, UI.gauge.arcEnd)} fill="none" stroke={UI.surface.track()} stroke-width={UI.gauge.stroke} stroke-linecap="round" />
          {sweep > 0 && <path d={describeArc(cx, cy, r, UI.gauge.arcStart, UI.gauge.arcStart + sweep)} fill="none" stroke={semanticColor((props.color as string) ?? "accent")} stroke-width={UI.gauge.stroke} stroke-linecap="round" />}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: 0, width: size, height: size }}>
          <span style={{ fontSize: size * UI.gauge.valueFontRatio * Math.min(1, 3 / display.length), fontWeight: UI.fontWeight.bold, color: UI.color.fg }}>{display}</span>
          <span style={{ fontSize: size * UI.gauge.unitFontRatio, color: UI.surface.muted() }}>{unit}</span>
        </div>
        <div style={{ display: "flex", position: "absolute", bottom: size * UI.gauge.labelBottomRatio, fontSize: size * UI.gauge.labelFontRatio, color: UI.surface.dim() }}>{props.label}</div>
      </div>
    );
  },
});
