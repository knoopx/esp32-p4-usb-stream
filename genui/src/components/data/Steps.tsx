import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { asArray, maxLinesStyle, wrapTextStyle } from "../helpers";

export const StepsItem = defineComponent({
  name: "StepsItem",
  props: z.object({
    title: z.string().describe("Step title."),
    details: z.string().optional().describe("Explanatory text for this step."),
  }),
  description: "A single step with title and optional details.",
  component: () => null,
});

export const Steps = defineComponent({
  name: "Steps",
  props: z.object({
    items: z.array(StepsItem.ref).describe("StepsItem children."),
  }),
  description: "Numbered sequential step list.",
  component: ({ props }) => {
    const items = asArray(props.items);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: UI.steps.gap }}>
        {items.map((item: any, i: number) => {
          const p = item.props ?? {};
          const isLast = i === items.length - 1;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "row", gap: UI.space.md }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: UI.steps.circleSize }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: UI.steps.circleSize, height: UI.steps.circleSize, borderRadius: UI.steps.circleSize / 2, backgroundColor: semanticColor("accent"), color: UI.color.bg, fontSize: UI.steps.numberSize, fontWeight: UI.fontWeight.bold, flexShrink: 0 }}>
                  {String(i + 1)}
                </div>
                {!isLast && <div style={{ display: "flex", width: 2, flexGrow: 1, backgroundColor: UI.separator.color(), marginTop: UI.space.xs, marginBottom: UI.space.xs }} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: UI.space.xs, paddingTop: UI.space.xs, paddingBottom: isLast ? 0 : UI.space.md, minWidth: 0 }}>
                <span style={{ ...wrapTextStyle, ...maxLinesStyle(3, UI.text.lineHeight), fontSize: UI.steps.titleSize, fontWeight: UI.fontWeight.bold, color: UI.color.fg, lineHeight: UI.text.lineHeight }}>{p.title}</span>
                {p.details && <span style={{ ...wrapTextStyle, ...maxLinesStyle(3, UI.text.lineHeight), fontSize: UI.steps.detailsSize, color: UI.surface.muted(), lineHeight: UI.text.lineHeight }}>{p.details}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});
