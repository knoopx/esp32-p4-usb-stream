import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum } from "../helpers";

export const Stat = defineComponent({
  name: "Stat",
  props: z.object({
    label: z.string().describe("Metric label."),
    value: z.string().describe("Prominent metric value."),
    unit: z.string().optional().describe("Unit suffix (e.g. %, ms, GB)."),
    helper: z.string().optional().describe("Helper text below the value."),
    color: colorEnum.default("default").describe("Value text color. Defaults to default."),
  }),
  description: "Compact metric card with label, prominent value, optional unit, and helper text. Grows to fill available row space.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: UI.stat.gap,
        backgroundColor: UI.stat.background(),
        borderRadius: UI.stat.radius,
        padding: UI.stat.padding,
        flexGrow: 1,
        flexBasis: 0,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: UI.stat.labelSize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{props.label}</span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: UI.space.xs, minWidth: 0 }}>
        <span style={{ fontSize: UI.stat.valueSize, fontWeight: UI.fontWeight.bold, color: semanticColor((props.color as string) ?? "default"), lineHeight: 1 }}>{props.value}</span>
        {props.unit && <span style={{ fontSize: UI.stat.unitSize, color: UI.surface.dim(), lineHeight: 1.1 }}>{props.unit}</span>}
      </div>
      {props.helper && <span style={{ fontSize: UI.stat.helperSize, color: UI.surface.dim(), lineHeight: UI.text.lineHeight }}>{props.helper}</span>}
    </div>
  ),
});
