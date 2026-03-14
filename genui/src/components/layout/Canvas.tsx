import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { ElementChild } from "../helpers";

export const Canvas = defineComponent({
  name: "Canvas",
  props: z.object({
    children: z.array(ElementChild).describe("Child components."),
  }),
  description:
    "720×720 root canvas. MUST be the root component. Sets background, font, and display dimensions.",
  component: ({ props, renderNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: UI.canvas.width,
        height: UI.canvas.height,
        backgroundColor: UI.color.bg,
        color: UI.color.fg,
        fontFamily: UI.fontFamily.text,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {renderNode(props.children)}
    </div>
  ),
});
