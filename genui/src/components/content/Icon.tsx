import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor, resolveIcon, ICON_NAMES } from "../../tokens";
import { colorEnum, iconStyle } from "../helpers";

export const Icon = defineComponent({
  name: "Icon",
  props: z.object({
    name: z.enum(ICON_NAMES as unknown as [string, ...string[]]).describe("Icon name from the built-in set."),
    color: colorEnum.default("accent").describe("Icon color. Defaults to accent."),
    size: z.number().default(UI.icon.defaultSize).describe(`Icon size in pixels. Defaults to ${UI.icon.defaultSize}.`),
  }),
  description: "Named icon from the built-in set. Use for custom color/size when passing to icon props.",
  component: ({ props }) => (
    <span style={iconStyle(props.size ?? UI.icon.defaultSize, semanticColor((props.color as string) ?? "accent"))}>
      {resolveIcon(props.name as string)}
    </span>
  ),
});
