import React from "react";
void React;
import { z } from "zod";
import { defineComponent } from "@openuidev/react-lang";
import { UI } from "../../tokens";
import { ElementChild } from "../helpers";

export const Card = defineComponent({
  name: "Card",
  props: z.object({
    children: z.array(ElementChild).describe("Child components."),
    variant: z.enum(["card", "sunk", "clear"]).default("card").describe("Visual style: card (elevated), sunk (recessed), clear (transparent). Defaults to card."),
  }),
  description: "Container with visual style.",
  component: ({ props, renderNode }) => {
    const variant = (props.variant as string) ?? "card";
    const bg = variant === "clear" ? "transparent" : variant === "sunk" ? UI.surface.track() : UI.card.background();
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: bg,
          borderRadius: variant === "clear" ? 0 : UI.card.radius,
          padding: UI.card.padding,
          ...(variant === "sunk" ? { borderWidth: 1, borderStyle: "solid", borderColor: UI.separator.color() } : {}),
        }}
      >
        {renderNode(props.children)}
      </div>
    );
  },
});
