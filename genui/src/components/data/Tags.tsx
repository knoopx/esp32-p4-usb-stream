import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor, resolveIcon } from "../../tokens";
import { colorEnum, asArray, iconStyle, wrapTextStyle } from "../helpers";

export const Tag = defineComponent({
  name: "Tag",
  props: z.object({
    text: z.string().describe("Tag label text."),
    icon: z.string().optional().describe("Named icon."),
    color: colorEnum.default("muted").describe("Tag color. Defaults to muted."),
  }),
  description: "Labeled tag pill with optional named icon.",
  component: () => null,
});

export const TagBlock = defineComponent({
  name: "TagBlock",
  props: z.object({
    tags: z.array(Tag.ref).describe("Tag children."),
  }),
  description: "Flow-wrapped group of Tag components.",
  component: ({ props }) => {
    const tags = asArray(props.tags);
    return (
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: UI.tagBlock.gap }}>
        {tags.map((tag: any, i: number) => {
          const p = tag.props ?? {};
          const color = semanticColor((p.color as string) ?? "muted");
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: UI.space.xs,
                backgroundColor: UI.surface.elevated(),
                borderRadius: UI.badge.radius,
                paddingLeft: UI.space.sm,
                paddingRight: UI.space.sm,
                paddingTop: UI.space.xs,
                paddingBottom: UI.space.xs,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: color,
              }}
            >
              {p.icon && <span style={iconStyle(UI.tagBlock.iconSize, color)}>{resolveIcon(p.icon)}</span>}
              <span style={{ ...wrapTextStyle, fontSize: UI.tagBlock.textSize, color, fontWeight: UI.fontWeight.bold, maxWidth: 220 }}>{p.text}</span>
            </div>
          );
        })}
      </div>
    );
  },
});
