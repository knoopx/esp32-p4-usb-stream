import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { asArray } from "../helpers";

export const Col = defineComponent({
  name: "Col",
  props: z.object({
    label: z.string().describe("Column header text."),
    type: z.enum(["string", "number"]).default("string").describe("Data type. number auto-aligns right. Defaults to string."),
    align: z.enum(["left", "center", "right"]).optional().describe("Explicit alignment. Overrides type default."),
  }),
  description: "Column definition for Table.",
  component: () => null,
});

export const Table = defineComponent({
  name: "Table",
  props: z.object({
    columns: z.array(Col.ref).describe("Column definitions."),
    rows: z.array(z.array(z.union([z.string(), z.number()]))).describe("Row data as 2D array."),
  }),
  description: "Data table with headers and rows. Max ~12 rows fit on display.",
  component: ({ props }) => {
    const columns = asArray(props.columns);
    const rows = asArray(props.rows) as unknown[][];
    if (!columns.length) return null;
    const colW = `${Math.floor(100 / columns.length)}%`;
    const alignMap: Record<string, string> = { left: "flex-start", center: "center", right: "flex-end" };

    function colAlign(c: any): string {
      if (c.props?.align) return c.props.align;
      if (c.props?.type === "number") return "right";
      return "left";
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row", height: UI.table.headerHeight, width: "100%" }}>
          {columns.map((c: any, j: number) => (
              <div key={j} style={{ display: "flex", width: colW, alignItems: "center", justifyContent: alignMap[colAlign(c)] ?? "flex-start", fontSize: UI.table.headerFontSize, fontWeight: UI.fontWeight.bold, color: UI.color.accent, paddingLeft: UI.table.cellPaddingX, paddingRight: UI.table.cellPaddingX, minWidth: 0, overflow: "hidden", whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word" }}>
                {c.props?.label ?? String(c)}
              </div>
          ))}
        </div>
        <div style={{ display: "flex", height: UI.separator.thickness, backgroundColor: UI.separator.color(), flexShrink: 0, width: "100%" }} />
        {rows.map((row: any, i: number) => {
          const cells = asArray(row);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "row", height: UI.table.rowHeight, width: "100%", backgroundColor: i % 2 === 0 ? UI.table.zebraBackground() : UI.color.bg }}>
              {cells.map((cell: any, j: number) => (
                  <div key={j} style={{ display: "flex", width: colW, alignItems: "center", justifyContent: alignMap[colAlign(columns[j])] ?? "flex-start", fontSize: UI.table.cellFontSize, color: UI.color.fg, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingLeft: UI.table.cellPaddingX, paddingRight: UI.table.cellPaddingX }}>
                    {String(cell ?? "")}
                  </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  },
});
