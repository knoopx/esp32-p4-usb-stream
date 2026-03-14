import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";

export const CodeBlock = defineComponent({
  name: "CodeBlock",
  props: z.object({
    language: z.string().describe("Language label (e.g. typescript, bash)."),
    codeString: z.string().describe("Code content to display."),
  }),
  description: "Code block with language label and monospace font.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: UI.surface.track(),
        borderRadius: UI.card.radius,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", padding: `${UI.space.xs}px ${UI.space.md}px`, backgroundColor: UI.surface.overlay() }}>
        <span style={{ fontSize: UI.codeBlock.languageSize, fontWeight: UI.fontWeight.bold, color: UI.surface.muted(), textTransform: "uppercase" as const }}>{props.language}</span>
      </div>
      <div style={{ display: "flex", padding: UI.space.md, overflow: "hidden" }}>
        <span style={{ fontFamily: UI.fontFamily.icon, fontSize: UI.codeBlock.codeSize, color: UI.color.fg, lineHeight: UI.codeBlock.codeLineHeight, whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{props.codeString}</span>
      </div>
    </div>
  ),
});
