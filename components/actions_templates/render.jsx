import React from "react";
import TwoColumn from "./two-column";

const templates = { TwoColumn };
export default function RenderActionTemplate({ data, template }) {
  const Component = templates?.[template];
  return Component ? <Component data={data} /> : null;
}
