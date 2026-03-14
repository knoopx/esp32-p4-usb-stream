import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { ElementChild, gapEnum, GAP_MAP } from "../helpers";

export const Stack = defineComponent({
  name: "Stack",
  props: z.object({
    children: z.array(ElementChild).describe("Child components."),
    direction: z.enum(["row", "column"]).default("column").describe("Layout direction. Defaults to column."),
    gap: gapEnum.default("md").describe("Spacing between children. Defaults to md."),
    align: z.enum(["start", "center", "end", "stretch", "baseline"]).default("stretch").describe("Cross-axis alignment. Defaults to stretch."),
    justify: z.enum(["start", "center", "end", "between", "around", "evenly"]).default("start").describe("Main-axis justification. Defaults to start."),
    wrap: z.boolean().default(false).describe("Wrap children to next line. Defaults to false."),
  }),
  description: "Flex container for arranging children in rows or columns.",
  component: ({ props, renderNode }) => {
    const justify = (props.justify as string) ?? "start";
    const needsSpace = justify === "center" || justify === "between" || justify === "around" || justify === "evenly";
    const alignMap: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
    const justifyMap: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: ((props.direction as string) ?? "column") as "row" | "column",
          gap: GAP_MAP[(props.gap as string) ?? "md"] ?? UI.space.md,
          alignItems: alignMap[(props.align as string) ?? "stretch"] ?? "stretch",
          justifyContent: justifyMap[justify] ?? "flex-start",
          ...(needsSpace ? { flexGrow: 1 } : {}),
          ...(props.wrap ? { flexWrap: "wrap" } : {}),
        }}
      >
        {renderNode(props.children)}
      </div>
    );
  },
});
