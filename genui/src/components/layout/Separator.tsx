import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";

export const Separator = defineComponent({
  name: "Separator",
  props: z.object({}),
  description: "Horizontal divider line.",
  component: () => (
    <div style={{ display: "flex", height: UI.separator.thickness, backgroundColor: UI.separator.color(), flexShrink: 0 }} />
  ),
});
