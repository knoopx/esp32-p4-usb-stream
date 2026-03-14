import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { asArray, iconProp, renderIcon } from "../helpers";

export const ListItem = defineComponent({
  name: "ListItem",
  props: z.object({
    text: z.string().describe("Primary text."),
    secondary: z.string().optional().describe("Secondary text below primary."),
    icon: iconProp.optional().describe("Named icon or Icon element. Uses accent color."),
    value: z.string().optional().describe("Right-side value text."),
  }),
  description: "List row with optional icon, secondary text, and right-side value.",
  component: () => null,
});

export const List = defineComponent({
  name: "List",
  props: z.object({
    items: z.array(ListItem.ref).describe("ListItem children."),
  }),
  description: "Vertical list with optional icons, secondary text, and right-side values. Max ~8 items fit.",
  component: ({ props, renderNode }) => {
    const items = asArray(props.items);
    const hasSecondary = items.some((it: any) => it.props?.secondary);
    const rowH = hasSecondary ? UI.list.rowDoubleHeight : UI.list.rowSingleHeight;

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item: any, i: number) => {
          const p = item.props ?? {};
          return (
            <div key={i} style={{ display: "flex", flexDirection: "row", alignItems: "center", minHeight: rowH, gap: UI.list.rowGap, paddingTop: UI.list.rowPaddingY, paddingBottom: UI.list.rowPaddingY, overflow: "hidden", ...(i < items.length - 1 ? { borderBottom: `${UI.separator.thickness}px solid ${UI.separator.color()}` } : {}) }}>
              {p.icon ? (
                renderIcon(p.icon, UI.list.iconSize, UI.color.accent, renderNode)
              ) : (
                <div style={{ display: "flex", width: UI.list.bulletWidth, alignSelf: "stretch", backgroundColor: UI.color.accent, borderRadius: UI.list.bulletRadius, flexShrink: 0 }} />
              )}
              <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flexShrink: 1, minWidth: 0, overflow: "hidden" }}>
                <span style={{ overflow: "hidden", whiteSpace: "pre-wrap", overflowWrap: "break-word", fontSize: UI.list.textSize, fontWeight: UI.fontWeight.bold, color: UI.color.fg, lineHeight: UI.text.lineHeight }}>{p.text}</span>
                {p.secondary && <span style={{ overflow: "hidden", whiteSpace: "pre-wrap", overflowWrap: "break-word", fontSize: UI.list.secondarySize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{p.secondary}</span>}
              </div>
              {p.value && <span style={{ fontSize: UI.list.valueSize, fontWeight: UI.fontWeight.bold, color: UI.surface.muted(), flexShrink: 0, maxWidth: UI.list.valueMaxWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.value}</span>}
            </div>
          );
        })}
      </div>
    );
  },
});
