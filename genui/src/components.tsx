/**
 * Waveshare Display UI components — OpenUI-compatible.
 *
 * Each component has a zod schema, description, and satori-compatible renderer.
 */

import React from "react";
import { z } from "zod";
import qrcode from "qrcode-generator";
import { readFileSync } from "fs";

void React;
import { defineComponent } from "@openuidev/react-lang";
import {
  BG,
  FG,
  ACCENT,
  FONT,
  FONT_WEIGHT,
  ICON_SIZE,
  SPACE,
  SIZE,
  UI,
  GAUGE,
  DISPLAY_WIDTH,
  DISPLAY_HEIGHT,
  ACCENT_BAR_HEIGHT,
  SEMANTIC_COLOR_NAMES,
  semanticColor,
  paletteColor,
  surface,
} from "./tokens";

// ─── Shared enums ─────────────────────────────────────────────────────────────

const colorEnum = z.enum(SEMANTIC_COLOR_NAMES);
const gapEnum = z.enum(["none", "xs", "sm", "md", "lg", "xl"]);

const GAP_MAP: Record<string, number> = {
  none: 0,
  xs: SPACE.xs,
  sm: SPACE.sm,
  md: SPACE.md,
  lg: SPACE.lg,
  xl: SPACE.xl,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start[0]} ${start[1]} A ${r} ${r} 0 ${large} 0 ${end[0]} ${end[1]}`;
}

function asArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : v != null ? [v] : [];
}

function percent(value: number, max: number): number {
  return max > 0 ? (value / max) * 100 : 0;
}

const ElementChild = z.object({
  type: z.literal("element"),
  typeName: z.string(),
  props: z.object({}).passthrough(),
  partial: z.boolean().optional(),
});

// ─── Layout components ────────────────────────────────────────────────────────

export const Stack = defineComponent({
  name: "Stack",
  props: z.object({
    children: z.array(ElementChild),
    direction: z.enum(["row", "column"]).optional(),
    gap: gapEnum.optional(),
    align: z.enum(["start", "center", "end", "stretch", "baseline"]).optional(),
    justify: z.enum(["start", "center", "end", "between", "around", "evenly"]).optional(),
    wrap: z.boolean().optional(),
  }),
  description:
    'Flex container. direction: "row"|"column" (default "column"). gap: "none"(0)|"xs"(4)|"sm"(8)|"md"(16)|"lg"(24)|"xl"(32). align: "start"|"center"|"end"|"stretch"|"baseline". justify: "start"|"center"|"end"|"between"|"around"|"evenly".',
  component: ({ props, renderNode }) => {
    const justify = (props.justify as string) ?? "start";
    const needsSpace = justify === "center" || justify === "between" || justify === "around" || justify === "evenly";
    const alignMap: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
    const justifyMap: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: ((props.direction as string) ?? "column") as "row" | "column",
          gap: GAP_MAP[(props.gap as string) ?? "md"] ?? SPACE.md,
          alignItems: alignMap[(props.align as string) ?? "stretch"] ?? "stretch",
          justifyContent: justifyMap[justify] ?? "flex-start",
          ...(needsSpace ? { flexGrow: 1 } : {}),
          ...(props.wrap ? { flexWrap: "wrap" } : {}),
        }}
      >
        {renderNode(props.children)}
      </div>
    );
  },
});

export const Canvas = defineComponent({
  name: "Canvas",
  props: z.object({
    children: z.array(ElementChild),
  }),
  description:
    "720×720 root canvas. MUST be the root component. Sets background, font, and display dimensions.",
  component: ({ props, renderNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: UI.canvas.width,
        height: UI.canvas.height,
        backgroundColor: BG,
        color: FG,
        fontFamily: "Inter",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {renderNode(props.children)}
    </div>
  ),
});

export const Header = defineComponent({
  name: "Header",
  props: z.object({
    icon: z.union([z.string(), ElementChild]),
    title: z.union([z.string(), z.array(ElementChild)]),
    subtitle: z.union([z.string(), z.array(ElementChild)]).optional(),
  }),
  description:
    "Page header with accent bar, icon, title, and optional subtitle. icon accepts a Nerd Font glyph string or an Icon element. Title and subtitle accept a string or child elements. Place as first child of Canvas.",
  component: ({ props, renderNode }) => {
    const isElement = (v: unknown): v is object => typeof v === "object" && v !== null && !Array.isArray(v);
    const isElementArray = (v: unknown): v is unknown[] => Array.isArray(v);
    return (
      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", width: "100%", height: ACCENT_BAR_HEIGHT, backgroundColor: ACCENT, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", padding: `${UI.header.paddingTop}px ${UI.header.paddingX}px 0`, gap: UI.header.contentGap }}>
          {isElement(props.icon) ? renderNode(props.icon) : <span style={{ fontFamily: "Nerd", fontSize: UI.header.iconSize, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: UI.header.iconSize, minWidth: UI.header.iconSize }}>{props.icon}</span>}
          <div style={{ display: "flex", alignItems: "center", gap: UI.header.contentGap, flexGrow: 1 }}>
            {isElementArray(props.title) ? renderNode(props.title) : <span style={{ fontSize: UI.header.titleSize, fontWeight: FONT_WEIGHT.bold, color: FG }}>{props.title}</span>}
          </div>
          {props.subtitle && (
            <div style={{ display: "flex", alignItems: "center", gap: UI.header.contentGap, flexShrink: 0 }}>
              {isElementArray(props.subtitle) ? renderNode(props.subtitle) : <span style={{ fontSize: UI.header.subtitleSize, color: surface.dim() }}>{props.subtitle}</span>}
            </div>
          )}
        </div>
        <div style={{ display: "flex", height: UI.header.sectionGap, flexShrink: 0 }} />
        <div style={{ display: "flex", height: SIZE.separator, backgroundColor: UI.separator.color(), marginLeft: UI.header.dividerInset, marginRight: UI.header.dividerInset, flexShrink: 0 }} />
      </div>
    );
  },
});

export const Content = defineComponent({
  name: "Content",
  props: z.object({
    children: z.array(ElementChild),
    gap: gapEnum.optional(),
  }),
  description: 'Scrollable content area below Header. Adds padding and overflow handling. gap: "none"(0)|"xs"(4)|"sm"(8)|"md"(16)|"lg"(24)|"xl"(32).',
  component: ({ props, renderNode }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: `${UI.content.paddingTop}px ${UI.content.paddingX}px ${UI.content.paddingBottom}px`,
        overflow: "hidden",
        ...(props.gap != null ? { gap: GAP_MAP[(props.gap as string)] ?? SPACE.md } : {}),
      }}
    >
      {renderNode(props.children)}
    </div>
  ),
});

// ─── Content components ───────────────────────────────────────────────────────

export const Text = defineComponent({
  name: "Text",
  props: z.object({
    content: z.string(),
    size: z.enum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"]).optional(),
    weight: z.enum(["normal", "bold"]).optional(),
    color: colorEnum.optional(),
    align: z.enum(["left", "center", "right"]).optional(),
  }),
  description:
    'Text block. size: "xs"(20)–"3xl"(80). color: semantic color name. align: "left"|"center"|"right".',
  component: ({ props }) => (
    <span
      style={{
        fontSize: FONT[(props.size as keyof typeof FONT) ?? "md"] ?? FONT.md,
        fontWeight: (props.weight ?? "normal") === "bold" ? FONT_WEIGHT.bold : FONT_WEIGHT.normal,
        color: semanticColor((props.color as string) ?? "default"),
        lineHeight: UI.text.lineHeight,
        ...(props.align ? { textAlign: props.align as "left" | "center" | "right" } : {}),
      }}
    >
      {props.content}
    </span>
  ),
});

export const Icon = defineComponent({
  name: "Icon",
  props: z.object({
    glyph: z.string(),
    color: colorEnum.optional(),
    size: z.number().optional(),
  }),
  description: 'Nerd Font icon glyph. Use Unicode escape like "\\uf058". color defaults to accent.',
  component: ({ props }) => (
    <span
      style={{
        fontFamily: "Nerd",
        fontSize: props.size ?? ICON_SIZE.sm,
        color: semanticColor((props.color as string) ?? "accent"),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: props.size ?? ICON_SIZE.sm,
        minWidth: props.size ?? ICON_SIZE.sm,
      }}
    >
      {props.glyph}
    </span>
  ),
});

export const Badge = defineComponent({
  name: "Badge",
  props: z.object({
    label: z.string(),
    color: colorEnum.optional(),
  }),
  description: "Colored pill badge with label text.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: semanticColor((props.color as string) ?? "accent"),
        color: BG,
        fontSize: UI.badge.fontSize,
        fontWeight: FONT_WEIGHT.bold,
        borderRadius: UI.badge.radius,
        paddingLeft: UI.badge.paddingX,
        paddingRight: UI.badge.paddingX,
        paddingTop: UI.badge.paddingY,
        paddingBottom: UI.badge.paddingY,
      }}
    >
      {props.label}
    </div>
  ),
});

export const Alert = defineComponent({
  name: "Alert",
  props: z.object({
    title: z.string(),
    message: z.string().optional(),
    icon: z.string().optional(),
    color: colorEnum.optional(),
  }),
  description: "Emphasized alert/callout box with optional icon, title, and message.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: UI.alert.gap,
        backgroundColor: UI.alert.background(),
        borderRadius: UI.alert.radius,
        padding: UI.alert.padding,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: semanticColor((props.color as string) ?? "accent"),
      }}
    >
      {props.icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Nerd",
            fontSize: UI.alert.iconSize,
            color: semanticColor((props.color as string) ?? "accent"),
            width: UI.alert.iconSize,
            minWidth: UI.alert.iconSize,
            flexShrink: 0,
          }}
        >
          {props.icon}
        </span>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs, flexGrow: 1, minWidth: 0 }}>
        <span style={{ fontSize: UI.alert.titleSize, fontWeight: FONT_WEIGHT.bold, color: FG, lineHeight: UI.text.lineHeight }}>{props.title}</span>
        {props.message && <span style={{ fontSize: UI.alert.messageSize, color: surface.muted(), lineHeight: UI.text.lineHeight }}>{props.message}</span>}
      </div>
    </div>
  ),
});

export const EmptyState = defineComponent({
  name: "EmptyState",
  props: z.object({
    title: z.string(),
    message: z.string().optional(),
    icon: z.string().optional(),
    color: colorEnum.optional(),
  }),
  description: "Centered empty state with optional icon, title, and supporting message.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: UI.emptyState.gap,
        flexGrow: 1,
        width: "100%",
        maxWidth: UI.emptyState.maxWidth,
        alignSelf: "center",
        textAlign: "center",
      }}
    >
      {props.icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Nerd",
            fontSize: UI.emptyState.iconSize,
            color: semanticColor((props.color as string) ?? "muted"),
            lineHeight: 1,
          }}
        >
          {props.icon}
        </span>
      )}
      <span style={{ fontSize: UI.emptyState.titleSize, fontWeight: FONT_WEIGHT.bold, color: FG, lineHeight: UI.text.lineHeight }}>{props.title}</span>
      {props.message && <span style={{ fontSize: UI.emptyState.messageSize, color: surface.muted(), lineHeight: UI.text.lineHeight }}>{props.message}</span>}
    </div>
  ),
});

export const Card = defineComponent({
  name: "Card",
  props: z.object({
    children: z.array(ElementChild),
    variant: z.enum(["card", "sunk", "clear"]).optional(),
  }),
  description: 'Container with visual style. variant: "card" (default, elevated), "sunk" (recessed), "clear" (transparent, padding only).',
  component: ({ props, renderNode }) => {
    const variant = (props.variant as string) ?? "card";
    const bg = variant === "clear" ? "transparent" : variant === "sunk" ? surface.track() : UI.card.background();
    const border = variant === "sunk" ? `1px solid ${UI.separator.color()}` : "none";
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: bg,
          borderRadius: variant === "clear" ? 0 : UI.card.radius,
          padding: UI.card.padding,
          ...(border !== "none" ? { borderWidth: 1, borderStyle: "solid", borderColor: UI.separator.color() } : {}),
        }}
      >
        {renderNode(props.children)}
      </div>
    );
  },
});

export const KeyValue = defineComponent({
  name: "KeyValue",
  props: z.object({
    label: z.string(),
    value: z.string(),
    secondary: z.string().optional(),
    color: colorEnum.optional(),
  }),
  description: "Label-value row for compact summaries, metadata, and settings screens.",
  component: ({ props }) => (
    <div style={{ display: "flex", alignItems: "center", gap: UI.keyValue.gap, minHeight: UI.keyValue.minHeight }}>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs, flexGrow: 1, minWidth: 0 }}>
        <span style={{ fontSize: UI.keyValue.labelSize, color: surface.muted(), lineHeight: UI.text.lineHeight }}>{props.label}</span>
        {props.secondary && <span style={{ fontSize: UI.keyValue.secondarySize, color: surface.dim(), lineHeight: UI.text.lineHeight }}>{props.secondary}</span>}
      </div>
      <span
        style={{
          fontSize: UI.keyValue.valueSize,
          fontWeight: FONT_WEIGHT.bold,
          color: semanticColor((props.color as string) ?? "default"),
          textAlign: "right",
          flexShrink: 0,
          maxWidth: "55%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.value}
      </span>
    </div>
  ),
});

export const Stat = defineComponent({
  name: "Stat",
  props: z.object({
    label: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    helper: z.string().optional(),
    color: colorEnum.optional(),
  }),
  description: "Compact metric card with label, prominent value, optional unit, and helper text. Grows to fill available row space.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: UI.stat.gap,
        backgroundColor: UI.stat.background(),
        borderRadius: UI.stat.radius,
        padding: UI.stat.padding,
        flexGrow: 1,
        flexBasis: 0,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: UI.stat.labelSize, color: surface.muted(), lineHeight: UI.text.lineHeight }}>{props.label}</span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: SPACE.xs, minWidth: 0 }}>
        <span style={{ fontSize: UI.stat.valueSize, fontWeight: FONT_WEIGHT.bold, color: semanticColor((props.color as string) ?? "default"), lineHeight: 1 }}>{props.value}</span>
        {props.unit && <span style={{ fontSize: UI.stat.unitSize, color: surface.dim(), lineHeight: 1.1 }}>{props.unit}</span>}
      </div>
      {props.helper && <span style={{ fontSize: UI.stat.helperSize, color: surface.dim(), lineHeight: UI.text.lineHeight }}>{props.helper}</span>}
    </div>
  ),
});

export const Separator = defineComponent({
  name: "Separator",
  props: z.object({}),
  description: "Horizontal divider line.",
  component: () => (
    <div style={{ display: "flex", height: SIZE.separator, backgroundColor: UI.separator.color(), flexShrink: 0 }} />
  ),
});

export const Spacer = defineComponent({
  name: "Spacer",
  props: z.object({}),
  description: "Flexible spacer that expands to fill available space.",
  component: () => <div style={{ display: "flex", flexGrow: 1 }} />,
});

// ─── Data Display ─────────────────────────────────────────────────────────────

export const Col = defineComponent({
  name: "Col",
  props: z.object({
    label: z.string(),
    type: z.enum(["string", "number"]).optional(),
    align: z.enum(["left", "center", "right"]).optional(),
  }),
  description: 'Column definition for Table. type: "string" (left-aligned) or "number" (right-aligned). align overrides type default.',
  component: () => null,
});

export const Table = defineComponent({
  name: "Table",
  props: z.object({
    columns: z.array(Col.ref),
    rows: z.array(z.array(z.union([z.string(), z.number()]))),
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
              <div key={j} style={{ display: "flex", width: colW, alignItems: "center", justifyContent: alignMap[colAlign(c)] ?? "flex-start", fontSize: UI.table.headerFontSize, fontWeight: FONT_WEIGHT.bold, color: ACCENT, paddingLeft: UI.table.cellPaddingX, paddingRight: UI.table.cellPaddingX }}>
                {c.props?.label ?? String(c)}
              </div>
          ))}
        </div>
        <div style={{ display: "flex", height: SIZE.separator, backgroundColor: UI.separator.color(), flexShrink: 0, width: "100%" }} />
        {rows.map((row: any, i: number) => {
          const cells = asArray(row);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "row", height: UI.table.rowHeight, width: "100%", backgroundColor: i % 2 === 0 ? UI.table.zebraBackground() : BG }}>
              {cells.map((cell: any, j: number) => (
                  <div key={j} style={{ display: "flex", width: colW, alignItems: "center", justifyContent: alignMap[colAlign(columns[j])] ?? "flex-start", fontSize: UI.table.cellFontSize, color: FG, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingLeft: UI.table.cellPaddingX, paddingRight: UI.table.cellPaddingX }}>
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

export const ListItem = defineComponent({
  name: "ListItem",
  props: z.object({
    text: z.string(),
    secondary: z.string().optional(),
    icon: z.string().optional(),
    value: z.string().optional(),
  }),
  description: "List row. icon is a Nerd Font glyph. value shows on the right side.",
  component: () => null,
});

export const List = defineComponent({
  name: "List",
  props: z.object({
    items: z.array(ListItem.ref),
  }),
  description: "Vertical list with optional icons, secondary text, and right-side values. Max ~8 items fit.",
  component: ({ props }) => {
    const items = asArray(props.items);
    const hasSecondary = items.some((it: any) => it.props?.secondary);
    const rowH = hasSecondary ? UI.list.rowDoubleHeight : UI.list.rowSingleHeight;
    const sepColor = UI.separator.color();

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item: any, i: number) => {
          const p = item.props ?? {};
          return (
            <div key={i} style={{ display: "flex", flexDirection: "row", alignItems: "center", minHeight: rowH, gap: UI.list.rowGap, paddingTop: UI.list.rowPaddingY, paddingBottom: UI.list.rowPaddingY, overflow: "hidden", ...(i < items.length - 1 ? { borderBottom: `${SIZE.separator}px solid ${sepColor}` } : {}) }}>
              {p.icon ? (
                <span style={{ fontFamily: "Nerd", fontSize: ICON_SIZE.sm, color: paletteColor(i), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: ICON_SIZE.sm, minWidth: ICON_SIZE.sm }}>{p.icon}</span>
              ) : (
                <div style={{ display: "flex", width: SIZE.listBulletWidth, alignSelf: "stretch", backgroundColor: paletteColor(i), borderRadius: UI.list.bulletRadius, flexShrink: 0 }} />
              )}
              <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flexShrink: 1, minWidth: 0, overflow: "hidden" }}>
                <span style={{ overflow: "hidden", whiteSpace: "pre-wrap", overflowWrap: "break-word", fontSize: UI.list.textSize, fontWeight: FONT_WEIGHT.bold, color: FG, lineHeight: UI.text.lineHeight }}>{p.text}</span>
                {p.secondary && <span style={{ overflow: "hidden", whiteSpace: "pre-wrap", overflowWrap: "break-word", fontSize: UI.list.secondarySize, color: surface.muted(), lineHeight: UI.text.lineHeight }}>{p.secondary}</span>}
              </div>
              {p.value && <span style={{ fontSize: UI.list.valueSize, fontWeight: FONT_WEIGHT.bold, color: surface.muted(), flexShrink: 0, maxWidth: UI.list.valueMaxWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.value}</span>}
            </div>
          );
        })}
      </div>
    );
  },
});

// ─── Data Visualization ───────────────────────────────────────────────────────

export const Gauge = defineComponent({
  name: "Gauge",
  props: z.object({
    label: z.string(),
    value: z.number(),
    max: z.number().optional(),
    unit: z.string().optional(),
    size: z.number().optional(),
    color: colorEnum.optional(),
  }),
  description: "Arc gauge showing value/max. Defaults: max=100, unit=\"%\", size=240. color defaults to accent.",
  component: ({ props }) => {
    const max = props.max ?? 100;
    const pct = percent(props.value, max);
    const display = max === 100 ? String(Math.round(props.value)) : `${props.value}/${max}`;
    const unit = props.unit ?? "%";
    const size = props.size ?? SIZE.gaugeDefault;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - SIZE.gaugeStroke;
    const sweep = Math.min(pct, 100) * GAUGE.arcSweep;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ position: "absolute" }}>
          <path d={describeArc(cx, cy, r, GAUGE.arcStart, GAUGE.arcEnd)} fill="none" stroke={surface.track()} stroke-width={SIZE.gaugeStroke} stroke-linecap="round" />
          {sweep > 0 && <path d={describeArc(cx, cy, r, GAUGE.arcStart, GAUGE.arcStart + sweep)} fill="none" stroke={semanticColor((props.color as string) ?? "accent")} stroke-width={SIZE.gaugeStroke} stroke-linecap="round" />}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: 0, width: size, height: size }}>
          <span style={{ fontSize: size * GAUGE.valueFontRatio * Math.min(1, 3 / display.length), fontWeight: FONT_WEIGHT.bold, color: FG }}>{display}</span>
          <span style={{ fontSize: size * GAUGE.unitFontRatio, color: surface.muted() }}>{unit}</span>
        </div>
        <div style={{ display: "flex", position: "absolute", bottom: size * GAUGE.labelBottomRatio, fontSize: size * GAUGE.labelFontRatio, color: surface.dim() }}>{props.label}</div>
      </div>
    );
  },
});

export const ProgressBar = defineComponent({
  name: "ProgressBar",
  props: z.object({
    label: z.string(),
    value: z.number(),
    max: z.number().optional(),
    display: z.string().optional(),
    color: colorEnum.optional(),
  }),
  description: "Horizontal progress bar with label and value display. max defaults to 100. color defaults to accent.",
  component: ({ props }) => {
    const max = props.max ?? 100;
    const pct = Math.min(percent(props.value, max), 100);
    const display = props.display ?? `${Math.round(pct)}%`;
    const vbW = SIZE.svgViewBoxWidth;
    const h = SIZE.progressBarHeight;
    const r = h / 2;
    const fillW = pct * (vbW / 100);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: UI.progressBar.labelGap }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: FONT.lg, fontWeight: FONT_WEIGHT.bold, color: FG }}>{props.label}</span>
          <span style={{ fontSize: FONT.md, color: surface.muted() }}>{display}</span>
        </div>
        <svg viewBox={`0 0 ${vbW} ${h}`} width="100%" height={h} preserveAspectRatio="none">
          <rect x="0" y="0" width={vbW} height={h} rx={r} ry={r} fill={surface.track()} />
          {fillW > r * 2 && <rect x="0" y="0" width={fillW} height={h} rx={r} ry={r} fill={semanticColor((props.color as string) ?? "accent")} />}
        </svg>
      </div>
    );
  },
});

export const Sparkline = defineComponent({
  name: "Sparkline",
  props: z.object({
    values: z.array(z.number()),
    color: colorEnum.optional(),
    height: z.number().optional(),
  }),
  description: "Mini line chart. Color defaults to accent. Height defaults to 40px. Full width.",
  component: ({ props }) => {
    const values = asArray(props.values);
    if (values.length < 2) return null;
    const color = semanticColor((props.color as string) ?? "accent");
    const vbW = SIZE.svgViewBoxWidth;
    const h = props.height ?? SIZE.sparklineHeight;
    const mn = Math.min(...values);
    const mx = Math.max(...values);
    const span = mx !== mn ? mx - mn : 1;
    const pad = SIZE.sparklinePad;
    const points = values.map((v, i) => `${pad + (i / (values.length - 1)) * (vbW - pad * 2)},${pad + (h - pad * 2) - ((v - mn) / span) * (h - pad * 2)}`).join(" ");

    return (
      <svg viewBox={`0 0 ${vbW} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} stroke-width={SIZE.sparklineStroke} stroke-linejoin="round" />
      </svg>
    );
  },
});

export const StatusDot = defineComponent({
  name: "StatusDot",
  props: z.object({
    up: z.boolean(),
  }),
  description: "Green/red status indicator dot.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        width: SIZE.statusDot,
        height: SIZE.statusDot,
        borderRadius: SIZE.statusDot / 2,
        backgroundColor: props.up ? semanticColor("green") : semanticColor("red"),
        flexShrink: 0,
      }}
    />
  ),
});

export const Timestamp = defineComponent({
  name: "Timestamp",
  props: z.object({}),
  description: "Shows current time in bottom-right corner. Place as last child of Canvas.",
  component: () => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return (
      <div style={{ display: "flex", position: "absolute", bottom: UI.timestamp.inset, right: UI.timestamp.inset, fontSize: UI.timestamp.fontSize, color: surface.dim() }}>{ts}</div>
    );
  },
});

// ─── Code Display ─────────────────────────────────────────────────────────────

export const CodeBlock = defineComponent({
  name: "CodeBlock",
  props: z.object({
    language: z.string(),
    codeString: z.string(),
  }),
  description: "Displays a code block with language label and monospace font. Renders as a sunk card with the language badge.",
  component: ({ props }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: surface.track(),
        borderRadius: UI.card.radius,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", padding: `${SPACE.xs}px ${SPACE.md}px`, backgroundColor: surface.overlay() }}>
        <span style={{ fontSize: FONT.xs, fontWeight: FONT_WEIGHT.bold, color: surface.muted(), textTransform: "uppercase" as const }}>{props.language}</span>
      </div>
      <div style={{ display: "flex", padding: SPACE.md, overflow: "hidden" }}>
        <span style={{ fontFamily: "Nerd", fontSize: FONT.sm, color: FG, lineHeight: 1.4, whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{props.codeString}</span>
      </div>
    </div>
  ),
});

// ─── Steps ────────────────────────────────────────────────────────────────────

export const StepsItem = defineComponent({
  name: "StepsItem",
  props: z.object({
    title: z.string(),
    details: z.string().optional(),
  }),
  description: "A single step with title and optional details text.",
  component: () => null,
});

export const Steps = defineComponent({
  name: "Steps",
  props: z.object({
    items: z.array(StepsItem.ref),
  }),
  description: "Numbered sequential step list. Each step has a title and optional details.",
  component: ({ props }) => {
    const items = asArray(props.items);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.sm }}>
        {items.map((item: any, i: number) => {
          const p = item.props ?? {};
          const isLast = i === items.length - 1;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "row", gap: SPACE.md }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 32 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 16, backgroundColor: semanticColor("accent"), color: BG, fontSize: FONT.sm, fontWeight: FONT_WEIGHT.bold, flexShrink: 0 }}>
                  {String(i + 1)}
                </div>
                {!isLast && <div style={{ display: "flex", width: 2, flexGrow: 1, backgroundColor: UI.separator.color(), marginTop: SPACE.xs, marginBottom: SPACE.xs }} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs, paddingTop: SPACE.xs, paddingBottom: isLast ? 0 : SPACE.md, minWidth: 0 }}>
                <span style={{ fontSize: FONT.md, fontWeight: FONT_WEIGHT.bold, color: FG, lineHeight: UI.text.lineHeight }}>{p.title}</span>
                {p.details && <span style={{ fontSize: FONT.sm, color: surface.muted(), lineHeight: UI.text.lineHeight }}>{p.details}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const Tag = defineComponent({
  name: "Tag",
  props: z.object({
    text: z.string(),
    icon: z.string().optional(),
    color: colorEnum.optional(),
  }),
  description: "Labeled tag pill with optional icon. color defaults to muted.",
  component: () => null,
});

export const TagBlock = defineComponent({
  name: "TagBlock",
  props: z.object({
    tags: z.array(Tag.ref),
  }),
  description: "Flow-wrapped group of Tag components.",
  component: ({ props }) => {
    const tags = asArray(props.tags);
    return (
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: SPACE.sm }}>
        {tags.map((tag: any, i: number) => {
          const p = tag.props ?? {};
          const color = semanticColor((p.color as string) ?? "muted");
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: SPACE.xs,
                backgroundColor: surface.elevated(),
                borderRadius: UI.badge.radius,
                paddingLeft: SPACE.sm,
                paddingRight: SPACE.sm,
                paddingTop: SPACE.xs,
                paddingBottom: SPACE.xs,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: color,
              }}
            >
              {p.icon && <span style={{ fontFamily: "Nerd", fontSize: FONT.sm, color, flexShrink: 0 }}>{p.icon}</span>}
              <span style={{ fontSize: FONT.sm, color, fontWeight: FONT_WEIGHT.bold }}>{p.text}</span>
            </div>
          );
        })}
      </div>
    );
  },
});

// ─── QRCode ───────────────────────────────────────────────────────────────────

export const QRCode = defineComponent({
  name: "QRCode",
  props: z.object({
    data: z.string(),
    size: z.number().optional(),
    color: colorEnum.optional(),
  }),
  description: "Renders a QR code from data string. Defaults: size=400, color=default (foreground).",
  component: ({ props }) => {
    const size = (props.size as number) ?? SIZE.qrCodeDefault;
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

// ─── Image ────────────────────────────────────────────────────────────────────

export const Image = defineComponent({
  name: "Image",
  props: z.object({
    src: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    fit: z.enum(["contain", "cover", "fill"]).optional(),
    borderRadius: z.number().optional(),
  }),
  description:
    "Displays an image from a file path or data URI. Paths are read and embedded as base64. fit defaults to 'contain'.",
  component: ({ props }) => {
    const w = (props.width as number) ?? DISPLAY_WIDTH;
    const h = (props.height as number) ?? DISPLAY_HEIGHT;
    const fit = (props.fit as string) ?? "contain";
    const br = (props.borderRadius as number) ?? 0;

    let src = props.src as string;
    // If it's a file path (not a data URI or URL), read and base64-encode it
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
