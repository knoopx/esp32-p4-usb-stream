import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum, asArray } from "../helpers";

export const Sparkline = defineComponent({
  name: "Sparkline",
  props: z.object({
    values: z.array(z.number()).describe("Data points for the line chart."),
    color: colorEnum.default("accent").describe("Line color. Defaults to accent."),
    height: z.number().default(UI.sparkline.height).describe(`Chart height in pixels. Defaults to ${UI.sparkline.height}.`),
  }),
  description: "Mini line chart. Full width.",
  component: ({ props }) => {
    const values = asArray(props.values);
    if (values.length < 2) return null;
    const color = semanticColor((props.color as string) ?? "accent");
    const vbW = UI.svgViewBoxWidth;
    const h = props.height ?? UI.sparkline.height;
    const mn = Math.min(...values);
    const mx = Math.max(...values);
    const span = mx !== mn ? mx - mn : 1;
    const pad = UI.sparkline.pad;
    const points = values.map((v, i) => `${pad + (i / (values.length - 1)) * (vbW - pad * 2)},${pad + (h - pad * 2) - ((v - mn) / span) * (h - pad * 2)}`).join(" ");

    return (
      <svg viewBox={`0 0 ${vbW} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} stroke-width={UI.sparkline.stroke} stroke-linejoin="round" />
      </svg>
    );
  },
});
