import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { ElementChild, iconProp, renderIcon } from "../helpers";

export const Header = defineComponent({
  name: "Header",
  props: z.object({
    icon: iconProp.describe("Named icon or Icon element."),
    title: z.union([z.string(), z.array(ElementChild)]).describe("Title text or child elements."),
    subtitle: z.union([z.string(), z.array(ElementChild)]).optional().describe("Optional subtitle text or child elements."),
  }),
  description:
    "Page header with accent bar, icon, title, and optional subtitle. Place as first child of Canvas.",
  component: ({ props, renderNode }) => {
    const isElementArray = (v: unknown): v is unknown[] => Array.isArray(v);
    return (
      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", width: "100%", height: UI.header.accentBarHeight, backgroundColor: UI.color.accent, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", padding: `${UI.header.paddingTop}px ${UI.header.paddingX}px 0`, gap: UI.header.contentGap }}>
          {renderIcon(props.icon, UI.header.iconSize, UI.color.accent, renderNode)}
          <div style={{ display: "flex", alignItems: "center", gap: UI.header.contentGap, flexGrow: 1 }}>
            {isElementArray(props.title) ? renderNode(props.title) : <span style={{ fontSize: UI.header.titleSize, fontWeight: UI.fontWeight.bold, color: UI.color.fg }}>{props.title}</span>}
          </div>
          {props.subtitle && (
            <div style={{ display: "flex", alignItems: "center", gap: UI.header.contentGap, flexShrink: 0 }}>
              {isElementArray(props.subtitle) ? renderNode(props.subtitle) : <span style={{ fontSize: UI.header.subtitleSize, color: UI.surface.dim() }}>{props.subtitle}</span>}
            </div>
          )}
        </div>
        <div style={{ display: "flex", height: UI.header.sectionGap, flexShrink: 0 }} />
        <div style={{ display: "flex", height: UI.separator.thickness, backgroundColor: UI.separator.color(), marginLeft: UI.header.dividerInset, marginRight: UI.header.dividerInset, flexShrink: 0 }} />
      </div>
    );
  },
});
