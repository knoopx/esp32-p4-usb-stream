import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum } from "../helpers";

export const KeyValue = defineComponent({
  name: "KeyValue",
  props: z.object({
    label: z.string().describe("Label text (left side)."),
    value: z.string().describe("Value text (right side)."),
    secondary: z.string().optional().describe("Secondary text below the label."),
    color: colorEnum.default("default").describe("Value text color. Defaults to default."),
  }),
  description: "Label-value row for compact summaries, metadata, and settings screens.",
  component: ({ props }) => (
    <div style={{ display: "flex", alignItems: "center", gap: UI.keyValue.gap, minHeight: UI.keyValue.minHeight }}>
      <div style={{ display: "flex", flexDirection: "column", gap: UI.space.xs, flexGrow: 1, minWidth: 0 }}>
        <span style={{ fontSize: UI.keyValue.labelSize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{props.label}</span>
        {props.secondary && <span style={{ fontSize: UI.keyValue.secondarySize, color: UI.surface.dim(), lineHeight: UI.text.lineHeight }}>{props.secondary}</span>}
      </div>
      <span
        style={{
          fontSize: UI.keyValue.valueSize,
          fontWeight: UI.fontWeight.bold,
          color: semanticColor((props.color as string) ?? "default"),
          textAlign: "right",
          flexShrink: 0,
          maxWidth: "55%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.value}
      </span>
    </div>
  ),
});
