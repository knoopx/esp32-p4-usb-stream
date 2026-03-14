import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";

export const Timestamp = defineComponent({
  name: "Timestamp",
  props: z.object({}),
  description: "Shows current time in bottom-right corner. Place as last child of Canvas.",
  component: () => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return (
      <div style={{ display: "flex", position: "absolute", bottom: UI.timestamp.inset, right: UI.timestamp.inset, fontSize: UI.timestamp.fontSize, color: UI.surface.dim() }}>{ts}</div>
    );
  },
});
