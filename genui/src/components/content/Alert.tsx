import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum, iconProp, maxLinesStyle, renderIcon, wrapTextStyle } from "../helpers";

export const Alert = defineComponent({
  name: "Alert",
  props: z.object({
    title: z.string().describe("Alert heading."),
    message: z.string().optional().describe("Supporting message text."),
    icon: iconProp.optional().describe("Named icon or Icon element. Inherits alert color."),
    color: colorEnum.default("accent").describe("Border and icon color. Defaults to accent."),
  }),
  description: "Emphasized alert/callout box with optional icon, title, and message.",
  component: ({ props, renderNode }) => {
    const color = semanticColor((props.color as string) ?? "accent");
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: UI.alert.gap,
          backgroundColor: UI.alert.background(),
          borderRadius: UI.alert.radius,
          padding: UI.alert.padding,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: color,
        }}
      >
        {props.icon && renderIcon(props.icon, UI.alert.iconSize, color, renderNode)}
        <div style={{ display: "flex", flexDirection: "column", gap: UI.space.xs, flexGrow: 1, minWidth: 0 }}>
          <span style={{ ...wrapTextStyle, ...maxLinesStyle(2, UI.text.lineHeight), fontSize: UI.alert.titleSize, fontWeight: UI.fontWeight.bold, color: UI.color.fg, lineHeight: UI.text.lineHeight }}>{props.title}</span>
          {props.message && <span style={{ ...wrapTextStyle, ...maxLinesStyle(2, UI.text.lineHeight), fontSize: UI.alert.messageSize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{props.message}</span>}
        </div>
      </div>
    );
  },
});
