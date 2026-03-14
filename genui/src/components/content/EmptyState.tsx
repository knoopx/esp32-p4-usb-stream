import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum, iconProp, maxLinesStyle, renderIcon, wrapTextStyle } from "../helpers";

export const EmptyState = defineComponent({
  name: "EmptyState",
  props: z.object({
    title: z.string().describe("Heading text."),
    message: z.string().optional().describe("Supporting message text."),
    icon: iconProp.optional().describe("Named icon or Icon element. Inherits component color."),
    color: colorEnum.default("muted").describe("Icon color. Defaults to muted."),
  }),
  description: "Centered empty state with optional icon, title, and supporting message.",
  component: ({ props, renderNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: UI.emptyState.gap,
        flexGrow: 1,
        width: "100%",
        maxWidth: UI.emptyState.maxWidth,
        alignSelf: "center",
        textAlign: "center",
      }}
    >
      {props.icon && renderIcon(props.icon, UI.emptyState.iconSize, semanticColor((props.color as string) ?? "muted"), renderNode)}
      <span style={{ ...wrapTextStyle, ...maxLinesStyle(3, UI.text.lineHeight), fontSize: UI.emptyState.titleSize, fontWeight: UI.fontWeight.bold, color: UI.color.fg, lineHeight: UI.text.lineHeight }}>{props.title}</span>
      {props.message && <span style={{ ...wrapTextStyle, ...maxLinesStyle(3, UI.text.lineHeight), fontSize: UI.emptyState.messageSize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{props.message}</span>}
    </div>
  ),
});
