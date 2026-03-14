import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum } from "../helpers";

export const Badge = defineComponent({
  name: "Badge",
  props: z.object({
    label: z.string().describe("Badge text."),
    color: colorEnum.default("accent").describe("Background color. Defaults to accent."),
  }),
  description: "Colored pill badge with label text.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        maxWidth: "100%",
        backgroundColor: semanticColor((props.color as string) ?? "accent"),
        color: UI.color.bg,
        fontSize: UI.badge.fontSize,
        fontWeight: UI.fontWeight.bold,
        borderRadius: UI.badge.radius,
        paddingLeft: UI.badge.paddingX,
        paddingRight: UI.badge.paddingX,
        paddingTop: UI.badge.paddingY,
        paddingBottom: UI.badge.paddingY,
        overflow: "hidden",
      }}
    >
      <span style={{ minWidth: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{props.label}</span>
    </div>
  ),
});
