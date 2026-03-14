import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";

export const StatusDot = defineComponent({
  name: "StatusDot",
  props: z.object({
    up: z.boolean().describe("true = green (up), false = red (down)."),
  }),
  description: "Green/red status indicator dot.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        width: UI.statusDot.size,
        height: UI.statusDot.size,
        borderRadius: UI.statusDot.size / 2,
        backgroundColor: props.up ? semanticColor("green") : semanticColor("red"),
        flexShrink: 0,
      }}
    />
  ),
});
