import React from "react";
void React;
import { z } from "zod";
import qrcode from "qrcode-generator";
import { defineComponent } from "@openuidev/react-lang";
import { UI, semanticColor } from "../../tokens";
import { colorEnum } from "../helpers";

export const QRCode = defineComponent({
  name: "QRCode",
  props: z.object({
    data: z.string().describe("Data to encode in the QR code."),
    size: z.number().default(UI.qrcode.defaultSize).describe(`QR code size in pixels. Defaults to ${UI.qrcode.defaultSize}.`),
    color: colorEnum.default("default").describe("Foreground color. Defaults to default (foreground)."),
  }),
  description: "QR code from a data string.",
  component: ({ props }) => {
    const size = (props.size as number) ?? UI.qrcode.defaultSize;
    const fg = semanticColor((props.color as string) ?? "default");
    const qr = qrcode(0, "M");
    qr.addData(props.data as string);
    qr.make();
    const count = qr.getModuleCount();
    const cellSize = size / count;
    const rects: React.ReactElement[] = [];
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          rects.push(
            <rect
              key={`${row}-${col}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fg}
            />,
          );
        }
      }
    }
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
        >
          {rects}
        </svg>
      </div>
    );
  },
});
