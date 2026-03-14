import React from "react";
void React;
import { z } from "zod";
import { readFileSync } from "fs";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";

export const Image = defineComponent({
  name: "Image",
  props: z.object({
    src: z.string().describe("File path or data URI. File paths are base64-embedded automatically."),
    width: z.number().default(UI.image.defaultWidth).describe(`Image width in pixels. Defaults to ${UI.image.defaultWidth}.`),
    height: z.number().default(UI.image.defaultHeight).describe(`Image height in pixels. Defaults to ${UI.image.defaultHeight}.`),
    fit: z.enum(["contain", "cover", "fill"]).default("contain").describe("Object-fit mode. Defaults to contain."),
    borderRadius: z.number().default(0).describe("Corner radius in pixels. Defaults to 0."),
  }),
  description: "Displays an image from a file path or data URI.",
  component: ({ props }) => {
    const w = (props.width as number) ?? UI.image.defaultWidth;
    const h = (props.height as number) ?? UI.image.defaultHeight;
    const fit = (props.fit as string) ?? "contain";
    const br = (props.borderRadius as number) ?? 0;

    let src = props.src as string;
    if (!src.startsWith("data:") && !src.startsWith("http")) {
      const buf = readFileSync(src);
      const ext = src.split(".").pop()?.toLowerCase() ?? "png";
      const mime =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "webp"
            ? "image/webp"
            : ext === "gif"
              ? "image/gif"
              : "image/png";
      src = `data:${mime};base64,${buf.toString("base64")}`;
    }

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={src}
          width={w}
          height={h}
          style={{
            objectFit: fit as "contain" | "cover" | "fill",
            borderRadius: br,
          }}
        />
      </div>
    );
  },
});
