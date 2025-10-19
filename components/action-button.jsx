import React from "react";
import { IfElse } from "../helpers";
import Media from "./media";

export default function ActionButton({ data, index }) {
  const { button, template } = data;
  const {
    background_color = {},
    icon,
    label,
    href = "javascript:void(0)"
  } = button;
  const { value: bg_color = "#000", text_color = "#fff" } = background_color;

  return (
    <a
      data-customize-trigger={`actions[${index}].button`}
      data-trigger={template ? `#template-${index}` : ""}
      href={`${href}`}
      target="_blank"
      style={{ "--bg-color": bg_color, "--text-color": text_color }}
      className="app-button w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-105"
    >
      {IfElse(icon, () => (
        <span className="flex h-5 w-5">
          <Media data={icon} />
        </span>
      ))}
      {label}
    </a>
  );
}
