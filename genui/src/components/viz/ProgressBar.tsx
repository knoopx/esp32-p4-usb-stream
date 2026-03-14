import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum, maxLinesStyle, percent } from "../helpers";

export const ProgressBar = defineComponent({
  name: "ProgressBar",
  props: z.object({
    label: z.string().describe("Bar label text."),
    value: z.number().describe("Current value."),
    max: z.number().default(100).describe("Maximum value. Defaults to 100."),
    display: z.string().optional().describe("Custom display text (e.g. '42/50'). Defaults to percentage."),
    color: colorEnum.default("accent").describe("Bar fill color. Defaults to accent."),
  }),
  description: "Horizontal progress bar with label and value display.",
  component: ({ props }) => {
    const max = props.max ?? 100;
    const pct = Math.min(percent(props.value, max), 100);
    const display = props.display ?? `${Math.round(pct)}%`;
    const vbW = UI.svgViewBoxWidth;
    const h = UI.progressBar.height;
    const r = h / 2;
    const fillW = pct * (vbW / 100);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: UI.progressBar.labelGap, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: UI.space.md, minWidth: 0 }}>
          <span style={{ minWidth: 0, flexGrow: 1, flexBasis: 0, ...maxLinesStyle(2, UI.text.lineHeight), whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word", fontSize: UI.progressBar.labelSize, fontWeight: UI.fontWeight.bold, color: UI.color.fg, lineHeight: UI.text.lineHeight }}>{props.label}</span>
          <span style={{ minWidth: 0, flexShrink: 1, maxWidth: "40%", textAlign: "right", ...maxLinesStyle(2, UI.text.lineHeight), whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word", fontSize: UI.progressBar.valueSize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{display}</span>
        </div>
        <svg viewBox={`0 0 ${vbW} ${h}`} width="100%" height={h} preserveAspectRatio="none">
          <rect x="0" y="0" width={vbW} height={h} rx={r} ry={r} fill={UI.surface.track()} />
          {fillW > r * 2 && <rect x="0" y="0" width={fillW} height={h} rx={r} ry={r} fill={semanticColor((props.color as string) ?? "accent")} />}
        </svg>
      </div>
    );
  },
});
