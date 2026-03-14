import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";

export const Spacer = defineComponent({
  name: "Spacer",
  props: z.object({}),
  description: "Flexible spacer that expands to fill available space.",
  component: () => <div style={{ display: "flex", flexGrow: 1 }} />,
});
