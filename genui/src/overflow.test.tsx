import { describe, expect, it } from "bun:test";
import React from "react";
import { Text } from "./components/content/Text";
import { Header } from "./components/layout/Header";
import { Alert } from "./components/content/Alert";
import { CodeBlock } from "./components/content/CodeBlock";
import { KeyValue } from "./components/data/KeyValue";
import { ProgressBar } from "./components/viz/ProgressBar";
import { parseOpenUILang } from "./openui-parser";
import { library } from "./library";
import { rasterize } from "./rasterizer";

function styleOf(node: any) {
  return node.props.style as Record<string, unknown>;
}

describe("overflow handling", () => {
  it("wraps long Text content instead of overflowing horizontally", () => {
    const element = Text.component({
      props: { content: "A very long line", size: "md", weight: "normal", color: "default", align: "left" },
    } as any) as React.ReactElement;

    expect(styleOf(element).whiteSpace).toBe("pre-wrap");
    expect(styleOf(element).overflowWrap).toBe("anywhere");
    expect(styleOf(element).width).toBe("100%");
  });

  it("lets Header title and subtitle clamp with multiline ellipsis styles", () => {
    const longSubtitle = "This subtitle is much longer than the available space and must visibly end with an ellipsis after wrapping across multiple lines in the header";
    const element = Header.component({
      props: { icon: "warning", title: "Long title", subtitle: longSubtitle },
      renderNode: (node: unknown) => node,
    } as any) as any;

    const row = element.props.children[1];
    const titleContainer = row.props.children[1];
    const title = titleContainer.props.children;
    const subtitleContainer = row.props.children[2];
    const subtitle = subtitleContainer.props.children;

    expect(styleOf(titleContainer).minWidth).toBe(0);
    expect(styleOf(title).overflowWrap).toBe("anywhere");
    expect(styleOf(title).textOverflow).toBe("ellipsis");
    expect(styleOf(title).WebkitLineClamp).toBe(3);
    expect(styleOf(title).maxHeight).toBe(`${3 * 1.2}em`);
    expect(styleOf(subtitleContainer).maxWidth).toBe("35%");
    expect(styleOf(subtitle).textOverflow).toBe("ellipsis");
    expect(styleOf(subtitle).WebkitLineClamp).toBe(3);
    expect(styleOf(subtitle).maxHeight).toBe(`${3 * 1.2}em`);
  });

  it("wraps long Alert titles and messages", () => {
    const element = Alert.component({
      props: { title: "Long alert title", message: "Long alert message", color: "yellow" },
      renderNode: (node: unknown) => node,
    } as any) as any;

    const body = element.props.children[1];
    const title = body.props.children[0];
    const message = body.props.children[1];

    expect(styleOf(title).overflowWrap).toBe("anywhere");
    expect(styleOf(message).overflowWrap).toBe("anywhere");
  });

  it("breaks long CodeBlock tokens to stay inside the card", () => {
    const element = CodeBlock.component({
      props: { language: "typescript", codeString: "const extraordinarilyLongIdentifierName = foo.bar.baz();" },
    } as any) as any;

    const codeWrapper = element.props.children[1];
    const code = codeWrapper.props.children;

    expect(styleOf(codeWrapper).minWidth).toBe(0);
    expect(styleOf(code).overflowWrap).toBe("anywhere");
    expect(styleOf(code).wordBreak).toBe("break-word");
  });

  it("allows KeyValue values to wrap and shrink instead of spilling out", () => {
    const element = KeyValue.component({
      props: {
        label: "Configuration label",
        value: "A very long value that should wrap instead of overflowing",
        secondary: "Secondary metadata",
        color: "accent",
      },
    } as any) as any;

    const value = element.props.children[1];

    expect(styleOf(element).alignItems).toBe("flex-start");
    expect(styleOf(value).overflowWrap).toBe("anywhere");
    expect(styleOf(value).flexShrink).toBe(1);
    expect(styleOf(value).maxWidth).toBe("45%");
  });

  it("lets ProgressBar label and display text wrap within the header row", () => {
    const element = ProgressBar.component({
      props: {
        label: "A very long progress label",
        value: 42,
        max: 100,
        display: "42 items completed out of 100 total items",
        color: "green",
      },
    } as any) as any;

    const labelRow = element.props.children[0];
    const label = labelRow.props.children[0];
    const display = labelRow.props.children[1];

    expect(styleOf(labelRow).minWidth).toBe(0);
    expect(styleOf(label).overflowWrap).toBe("anywhere");
    expect(styleOf(display).overflowWrap).toBe("anywhere");
    expect(styleOf(display).maxWidth).toBe("40%");
  });

  it("rasterizes a long-content screen without throwing", async () => {
    const source = `root = Canvas([header, content, ts])
header = Header("warning", "Extremely long header title that should not overlap the subtitle area when content grows", "A very long subtitle that must stay contained")
content = Content([alert, code, kv, prog], "md")
alert = Alert("Alert title that is long enough to test wrapping", "This message is intentionally verbose so it can reveal overflow bugs in the alert component when content exceeds the comfortable size of the card.", "warning", "yellow")
code = CodeBlock("typescript", "const extraordinarilyLongIdentifierName = someFunctionCall(withAnArgumentThatIsTooLongToFitNormally, anotherArgument, thirdArgument);")
kv = KeyValue("Configuration label with a secondary explanation", "A very long value that should wrap inside the row instead of running off-screen", "Secondary metadata that should also remain readable", "accent")
prog = ProgressBar("Long progress label that may collide with the display string", 42, 100, "42 items completed out of 100 total items", "green")
ts = Timestamp()`;

    const { element, warnings } = parseOpenUILang(source, library);
    expect(warnings).toHaveLength(0);

    const image = await rasterize(element, { rotate: 0 });
    expect(image.byteLength).toBeGreaterThan(1000);
  });
});
