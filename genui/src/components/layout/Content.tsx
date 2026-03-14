import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { ElementChild, gapEnum, GAP_MAP } from "../helpers";

export const Content = defineComponent({
  name: "Content",
  props: z.object({
    children: z.array(ElementChild).describe("Child components."),
    gap: gapEnum.default("md").describe("Spacing between children. Defaults to md."),
  }),
  description: "Scrollable content area below Header. Adds padding and overflow handling.",
  component: ({ props, renderNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: `${UI.content.paddingTop}px ${UI.content.paddingX}px ${UI.content.paddingBottom}px`,
        overflow: "hidden",
        gap: GAP_MAP[(props.gap as string) ?? ""] ?? UI.content.defaultGap,
      }}
    >
      {renderNode(props.children)}
    </div>
  ),
});
