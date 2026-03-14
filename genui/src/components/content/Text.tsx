import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum, wrapTextStyle } from "../helpers";

export const Text = defineComponent({
  name: "Text",
  props: z.object({
    content: z.string().describe("Text to display."),
    size: z.enum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"]).default("md").describe("Font size. Defaults to md."),
    weight: z.enum(["normal", "bold"]).default("normal").describe("Font weight. Defaults to normal."),
    color: colorEnum.default("default").describe("Text color. Defaults to default (foreground)."),
    align: z.enum(["left", "center", "right"]).default("left").describe("Text alignment. Defaults to left."),
  }),
  description: "Text block with configurable size, weight, color, and alignment.",
  component: ({ props }) => (
    <span
      style={{
        ...wrapTextStyle,
        display: "block",
        width: "100%",
        fontSize: UI.font[(props.size as keyof typeof UI.font) ?? "md"] ?? UI.font.md,
        fontWeight: (props.weight ?? "normal") === "bold" ? UI.fontWeight.bold : UI.fontWeight.normal,
        color: semanticColor((props.color as string) ?? "default"),
        lineHeight: UI.text.lineHeight,
        ...(props.align ? { textAlign: props.align as "left" | "center" | "right" } : {}),
      }}
    >
      {props.content}
    </span>
  ),
});
