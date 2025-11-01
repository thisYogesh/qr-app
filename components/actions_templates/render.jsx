import React from "react";
import TwoColumn from "./two-column";
import PlainText from "./plain-text";

const templates = { TwoColumn, PlainText };
export default function RenderActionTemplate({ data, template }) {
  const Component = templates?.[template];
  return Component ? <Component data={data} /> : null;
}
